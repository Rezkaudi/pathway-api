export interface Pathway {
    _id: string,
    userId: string;
    title?: string | null;
    description?: string | null;
    species?: string | null;
    category?: string | null;
    tissue?: {
        id: string,
        parent: string,
        text: string
    } | null,
    relatedDisease?: string | null,
    diseaseInput?: {
        Disease_id: string,
        Disease_name: string
    } | null,
    reactions: any | [],
    recordDate?: string | null,
    pubMeds: {
        id: string,
    }[],
    createdAt: Date,
    updatedAt: Date,
}
export interface ExportedPathway {
    pathway_id: string;
    pathway_name: string | null | undefined;
    pathway_description: string | null | undefined;
    pathway_category: string | null | undefined;
    pathway_reference: {
        id: string;
    }[];
    pathway_taxon: string | null | undefined;
    pathway_tissue: {
        id: string;
        parent: string;
        text: string;
    } | null | undefined;
    pathway_disease: string | null | undefined;
    pathway_reactions_num: any;
    reactions: any;
    pathway_created: string | null | undefined;
}

// Define the Reaction interface based on your data
