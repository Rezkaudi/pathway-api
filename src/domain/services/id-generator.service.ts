export interface IdGeneratorService {
    generateNextIdForUser(): Promise<string>;
    generateNextIdForPathway(): Promise<string>;
}
