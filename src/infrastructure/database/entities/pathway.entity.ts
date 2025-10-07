import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity('pathways')
export class PathwayEntity {
    @PrimaryColumn()
    _id!: string;

    @PrimaryColumn({ name: 'userId' })
    userId!: string;

    @ManyToOne(() => UserEntity, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })

    @JoinColumn({ name: 'userId' })
    user!: UserEntity;

    @Column({ type: 'varchar', length: 255, nullable: true })
    title?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    species?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    category?: string | null;

    @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
    tissue?: any | null;

    @Column({ type: 'varchar', name: 'relatedDisease', length: 255, nullable: true })
    relatedDisease?: string | null;

    @Column({ type: 'jsonb', name: 'diseaseInput', default: () => "'{}'::jsonb" })
    diseaseInput?: any | null;

    @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
    reactions?: any;

    @Column({ type: 'varchar', name: 'recordDate', length: 255, nullable: true })
    recordDate?: string | null;

    @Column({ type: 'jsonb', name: 'pubMeds', default: () => "'[]'::jsonb" })
    pubMeds?: any;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}