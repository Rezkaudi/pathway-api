import { Repository, ILike, Between, LessThanOrEqual, MoreThanOrEqual, In, Raw } from 'typeorm';

import { PathwayEntity } from '../entities/pathway.entity';
import { AppDataSource } from '../config/database.config';

import { PathwayRepository } from '../../../domain/repository/pathway.repository';
import { Pathway } from '../../../domain/entity/pathway.entity';
import { FilterPathwayDTO, PathwayWithPaginationDTO } from '../../../application/dtos/pathway.dto';


export class PostgreSQLPathwayRepository implements PathwayRepository {
    private repository: Repository<PathwayEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(PathwayEntity);
    }

    getAll = async (limit: number, offset: number, filters: FilterPathwayDTO): Promise<PathwayWithPaginationDTO> => {
        const { search, category, year, orderBy, orderDirection } = filters;

        // Build where conditions
        const where: any = {};

        if (search) {
            where.title = ILike(`%${search}%`);
        }

        if (category) {
            where.category = category;
        }

        if (year) {
            // Use Raw to handle the year extraction from recordDate
            where.recordDate = Raw(alias => `EXTRACT(YEAR FROM TO_DATE(${alias}, 'YYYY-MM-DD')) = :year`, { year });
        }

        // Handle ordering
        let order: any = {};
        if (orderBy === 'recordDate') {
            // Custom ordering for recordDate
            order = {
                recordDate: orderDirection
            };
        } else {
            order[orderBy] = orderDirection;
        }

        const [pathways, totalCount] = await this.repository.findAndCount({
            select: ['_id', 'title', 'species', 'category', 'recordDate'],
            where,
            order,
            take: limit,
            skip: offset
        });

        return {
            totalCount,
            pathways: pathways.map(p => ({
                _id: p._id,
                title: p.title,
                species: p.species,
                category: p.category,
                recordDate: p.recordDate
            }))
        };
    };

    delete = async (id: string): Promise<void> => {
        await this.repository.delete(id);
    };

    create = async (pathway: Pathway): Promise<Pathway> => {
        const cleanString = (value: any) => typeof value === 'string' ? value.trim().toLowerCase() : value;

        const pathwayEntity = this.toEntity(pathway);
        console.log(pathwayEntity)

        // Clean string fields
        if (pathwayEntity.title) pathwayEntity.title = cleanString(pathwayEntity.title);
        if (pathwayEntity.description) pathwayEntity.description = cleanString(pathwayEntity.description);
        if (pathwayEntity.species) pathwayEntity.species = cleanString(pathwayEntity.species);
        if (pathwayEntity.category) pathwayEntity.category = cleanString(pathwayEntity.category);
        if (pathwayEntity.relatedDisease) pathwayEntity.relatedDisease = cleanString(pathwayEntity.relatedDisease);

        const savedEntity = await this.repository.save(pathwayEntity);
        return this.toDomain(savedEntity);
    };

    findById = async (id: string): Promise<Pathway | null> => {
        const entity = await this.repository.findOne({
            where: { _id: id }
        });
        return entity ? this.toDomain(entity) : null;
    };

    findByUserId = async (userId: string, limit: number, offset: number, filters: FilterPathwayDTO): Promise<PathwayWithPaginationDTO> => {
        const { search, category, year, orderBy, orderDirection } = filters;

        // Build where conditions including userId
        const where: any = { userId };

        if (search) {
            where.title = ILike(`%${search}%`);
        }

        if (category) {
            where.category = category;
        }

        if (year) {
            where.recordDate = Raw(alias => `EXTRACT(YEAR FROM TO_DATE(${alias}, 'YYYY-MM-DD')) = :year`, { year });
        }

        // Handle ordering
        let order: any = {};
        if (orderBy === 'recordDate') {
            order = {
                recordDate: orderDirection
            };
        } else {
            order[orderBy] = orderDirection;
        }

        const [pathways, totalCount] = await this.repository.findAndCount({
            select: ['_id', 'title', 'species', 'category', 'recordDate'],
            where,
            order,
            take: limit,
            skip: offset
        });

        return {
            totalCount,
            pathways: pathways.map(p => ({
                _id: p._id,
                title: p.title,
                species: p.species,
                category: p.category,
                recordDate: p.recordDate
            }))
        };
    };

    update = async (id: string, pathwayData: Partial<Pathway>): Promise<Pathway | null> => {
        const entity = await this.repository.findOne({
            where: { _id: id }
        });

        if (!entity) return null;

        // Clean string fields if they exist in the update data
        const cleanString = (value: any) => typeof value === 'string' ? value.trim().toLowerCase() : value;

        if (pathwayData.title !== undefined) pathwayData.title = cleanString(pathwayData.title);
        if (pathwayData.description !== undefined) pathwayData.description = cleanString(pathwayData.description);
        if (pathwayData.species !== undefined) pathwayData.species = cleanString(pathwayData.species);
        if (pathwayData.category !== undefined) pathwayData.category = cleanString(pathwayData.category);
        if (pathwayData.relatedDisease !== undefined) pathwayData.relatedDisease = cleanString(pathwayData.relatedDisease);

        // Update the entity
        Object.assign(entity, pathwayData);
        entity.updatedAt = new Date();

        const updatedEntity = await this.repository.save(entity);
        return this.toDomain(updatedEntity);
    };

    async getAllIds(): Promise<string[]> {
        const entities = await this.repository.find({ select: ['_id'] });
        return entities.map(e => e._id);
    }

    // Convert Domain Pathway to PathwayEntity
    private toEntity(domain: Pathway): PathwayEntity {
        const entity = new PathwayEntity();
        entity._id = domain._id;
        entity.userId = domain.userId;
        entity.title = domain.title;
        entity.description = domain.description;
        entity.species = domain.species;
        entity.category = domain.category;
        entity.tissue = typeof domain.tissue === 'string'
            ? JSON.parse(domain.tissue)
            : domain.tissue || {}

        entity.relatedDisease = domain.relatedDisease;
        entity.diseaseInput = typeof domain.diseaseInput === 'string'
            ? JSON.parse(domain.diseaseInput)
            : domain.diseaseInput || {}

        // Parse the string to JSON if it's a string, otherwise keep as is
        entity.reactions = typeof domain.reactions === 'string'
            ? JSON.parse(domain.reactions)
            : domain.reactions || [];

        entity.recordDate = domain.recordDate;
        entity.pubMeds = typeof domain.pubMeds === 'string'
            ? JSON.parse(domain.pubMeds)
            : domain.pubMeds || [];

        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }

    // Convert PathwayEntity to Domain Pathway
    private toDomain(entity: PathwayEntity): Pathway {
        return {
            _id: entity._id,
            userId: entity.userId,
            title: entity.title,
            description: entity.description,
            species: entity.species,
            category: entity.category,
            tissue: typeof entity.tissue === 'string'
                ? JSON.parse(entity.tissue)
                : entity.tissue || {},

            relatedDisease: entity.relatedDisease,
            diseaseInput: typeof entity.diseaseInput === 'string'
                ? JSON.parse(entity.diseaseInput)
                : entity.diseaseInput || {},

            reactions: typeof entity.reactions === 'string'
                ? JSON.parse(entity.reactions)
                : entity.reactions || [],

            recordDate: entity.recordDate,
            pubMeds: typeof entity.pubMeds === 'string'
                ? JSON.parse(entity.pubMeds)
                : entity.pubMeds || [],
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
}

