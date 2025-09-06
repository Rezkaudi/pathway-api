import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryColumn()
    _id!: string;

    @Column({ type: 'varchar', length: 255 })
    @Index({ unique: true })
    email!: string;

    @Column({ type: 'varchar', length: 255 })
    password!: string;

    @Column({ type: 'varchar', length: 255 })
    firstName!: string;

    @Column({ type: 'varchar', length: 255 })
    lastName!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    profileImageUrl?: string | null;

    @Column({ type: 'boolean', default: false })
    isVerified!: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    verificationToken?: string | null;

    @Column({ type: 'timestamp', nullable: true })
    verificationTokenExpiresAt?: Date | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    resetPasswordToken?: string | null;

    @Column({ type: 'timestamp', nullable: true })
    resetPasswordTokenExpiresAt?: Date | null;

    @Column({ type: 'text', nullable: true })
    biography?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    phoneNumber?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    degree?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    university?: string | null;

    @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
    links: any[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}