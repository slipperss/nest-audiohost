import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {Track} from "../tracks/tracks.entity";
import {User} from "../users/users.entity";

@Entity("albums")
export class Album {

  @ApiProperty({example: "1", description: "Unique Identifier"})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: "The best tracks of 2022", description: "Album Title"})
  @Column({length: 25, nullable: false, unique: true})
  title: string;

  @ApiProperty({example: "2022-11-16T11:48:27.112Z", description: "Created Date"})
  @CreateDateColumn({name: "createdAt", type: "timestamp"})
  createdAt: Date;

  @ApiProperty({example: "2022-11-16T11:49:11.571Z", description: "Updated Date"})
  @UpdateDateColumn({name: "updatedAt", type: "timestamp", select: false})
  updatedAt: Date;

  @ApiProperty({type: () => [Track], description: "Tracks in Album"})
  @ManyToMany(() => Track, {eager: false})
  @JoinTable({name: "album-tracks", joinColumn: {name: "albumId"}, inverseJoinColumn: {name: "trackId"},})
  tracks: Track[]

  @ApiProperty({type:() => User, description: "Album Owner"})
  @ManyToOne(() => User, (user) => user.albums, {eager: false})
  owner: User

  @ApiProperty({type: () => [User], description: "Users Who Liked Album"})
  @ManyToMany(() => User, {eager: false})
  @JoinTable({name: "album-likes"})
  usersLiked: User[]

}