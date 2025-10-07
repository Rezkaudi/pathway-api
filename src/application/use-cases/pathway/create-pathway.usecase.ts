import { Pathway } from "../../../domain/entity/pathway.entity";
import { PathwayRepository } from "../../../domain/repository/pathway.repository";
import { IdGeneratorService } from "../../../domain/services/id-generator.service";


export class CreatePathwayUseCase {

    constructor(
        private readonly pathwayRepository: PathwayRepository,
        private readonly idOrderedGeneratorService: IdGeneratorService,
    ) { }

    execute = async (data: Partial<Pathway>): Promise<Pathway | null> => {

        const pathwayData: Pathway = {
            _id: `HGA_PR_${await this.idOrderedGeneratorService.generateNextIdForPathway()}`,
            userId: data.userId as string,
            title: data.title || null,
            description: data.description || null,
            species: data.species || null,
            category: data.category || null,
            tissue: data.tissue || null,
            relatedDisease: data.relatedDisease || null,
            diseaseInput: data.diseaseInput || null,
            reactions: data.reactions || null,
            recordDate: data.recordDate || null,
            pubMeds: data.pubMeds || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const pathway = await this.pathwayRepository.create(pathwayData);

        return pathway
    }
}
