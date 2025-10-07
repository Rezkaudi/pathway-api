import { ExportedPathway } from "../../../domain/entity/pathway.entity";
import { PathwayRepository } from "../../../domain/repository/pathway.repository";
import { NotFoundError } from "../../errors/application-error";

export class ExportPathwayUseCase {
    constructor(
        private readonly pathwayRepository: PathwayRepository
    ) { }

    execute = async (id: string): Promise<ExportedPathway> => {
        const pathway = await this.pathwayRepository.findById(id);
        console.log(pathway);

        if (!pathway) {
            throw new NotFoundError("Pathway not found");
        }

        const newPathway = {
            "pathway_id": pathway._id,
            "pathway_name": pathway.title,
            "pathway_description": pathway.description,
            "pathway_category": pathway.category,
            "pathway_reference": pathway.pubMeds,
            "pathway_taxon": pathway.species,
            "pathway_tissue": pathway.tissue,
            "pathway_disease": pathway.relatedDisease,
            "pathway_reactions_num": pathway.reactions.length,
            "reactions": pathway.reactions,
            "pathway_created": pathway.recordDate,
        }

        return newPathway;
    }
}