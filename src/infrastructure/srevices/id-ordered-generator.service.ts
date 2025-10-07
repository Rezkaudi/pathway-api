import { PostgreSQLUserRepository } from "../database/repository/postgresql-user.repository";
import { PostgreSQLPathwayRepository } from "../database/repository/postgresql-pathway.repository";

export class IdOrderedGeneratorService {
    private userRepository: PostgreSQLUserRepository;
    private pathwayRepository: PostgreSQLPathwayRepository;
    private currentUserIndex: number = 0;
    private currentPathwayIndex: number = 0;
    private userInitialized: boolean = false;
    private pathwayInitialized: boolean = false;

    constructor(
        userRepository: PostgreSQLUserRepository,
        pathwayRepository: PostgreSQLPathwayRepository
    ) {
        this.userRepository = userRepository;
        this.pathwayRepository = pathwayRepository;
    }

    private extractNumber(id: string): number {
        const match = id.match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
    }

    private async initializeUser(): Promise<void> {
        if (this.userInitialized) return;

        const userIds = await this.userRepository.getAllIds();

        const maxId = userIds.reduce((max, id) => {
            const num = this.extractNumber(id);
            return num > max ? num : max;
        }, 0);

        this.currentUserIndex = maxId;
        this.userInitialized = true;
    }

    private async initializePathway(): Promise<void> {
        if (this.pathwayInitialized) return;

        const pathwayIds = await this.pathwayRepository.getAllIds();

        const maxId = pathwayIds.reduce((max, id) => {
            const num = this.extractNumber(id);
            return num > max ? num : max;
        }, 0);

        this.currentPathwayIndex = maxId;
        this.pathwayInitialized = true;
    }

    public async generateNextIdForUser(): Promise<string> {
        await this.initializeUser();
        this.currentUserIndex++;
        return this.currentUserIndex.toString().padStart(5, '0');
    }

    public async generateNextIdForPathway(): Promise<string> {
        await this.initializePathway();
        this.currentPathwayIndex++;
        return this.currentPathwayIndex.toString().padStart(5, '0');
    }
}