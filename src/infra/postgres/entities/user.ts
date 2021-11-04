import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class PgUser {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ nullable: true })
  facebook_id?: string
}
