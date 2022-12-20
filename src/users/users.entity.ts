import {ApiProperty} from "@nestjs/swagger";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn, OneToMany
} from 'typeorm';

import {Role} from "../roles/roles.entity";
import {Track} from "../tracks/tracks.entity";
import {Playlist} from "../playlists/playlist.entity";
import {Album} from "../albums/albums.entity";

@Entity("users")
export class User {

  @ApiProperty({example: "1", description: "Unique Identifier"})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: "example@gmail.com", description: "Email Address"})
  @Column({nullable: false, unique: true})
  email: string;

  @ApiProperty({example: "megatron123", description: "Username"})
  @Column({nullable: false, unique: true})
  username: string;

  //@ApiProperty({example: "12345678", description: "Password"})
  @Column({nullable: false, select: false})
  password: string;

  @ApiProperty({example: "avatar.jpg", description: "User Avatar"})
  @Column({default: "avatars/default.jpg"})
  avatar: string;

  @ApiProperty({example: "false", description: "Is Banned"})
  @Column({default: false, select: false})
  banned: boolean

  @ApiProperty({example: "Cheating", description: "Ban Reason"})
  @Column({default: "", type: "text", select: false})
  banReason: string;

  @ApiProperty({example: "2022-11-16T11:48:27.112Z", description: "Created Date"})
  @CreateDateColumn({name: "createdAt", type: "timestamp"})
  createdAt: Date;

  @ApiProperty({example: "2022-11-16T11:49:11.571Z", description: "Updated Date"})
  @UpdateDateColumn({name: "updatedAt", type: "timestamp", nullable: true, select: false})
  updatedAt: Date;

  @ApiProperty({example: "2022-11-16T11:48:27.112Z", description: "Last Activity"})
  @Column({type: "timestamp", nullable: true})
  last_activity: Date;

  @ApiProperty({example: "false", description: "Is Verified"})
  @Column({default: false, select: false})
  verified: boolean;

  @ApiProperty({example: "false", description: "Is Registered with Google"})
  @Column({default: false, select: false})
  isRegisteredWithGoogle: boolean

  //@ApiProperty({type: () => [Role], description: "User Roles"})
  @ManyToMany(() => Role, {nullable: false, eager: false})
  @JoinTable({name: "user-roles"})
  roles: Role[]

  //@ApiProperty({type: () => [Track], description: "Post Avatar Image"})
  @OneToMany(() => Track, (track) => track.author, {eager: false})
  tracks: Track[]

  //@ApiProperty({type: () => [Track], description: "User Liked Tracks"})
  @ManyToMany(() => Track, {eager: false})
  @JoinTable({name: "track-likes"})
  likedTracks: Track[]

  //@ApiProperty({type: () => [Track], description: "User Listened Tracks"})
  @ManyToMany(() => Track, {eager: false})
  @JoinTable({name: "track-listenings"})
  listenedTracks: Track[]

  //@ApiProperty({type: () => [Playlist], description: "User Playlists"})
  @OneToMany(() => Playlist, (playlist) => playlist.owner, {eager: false})
  playlists: Playlist[]

  //@ApiProperty({type: () => [Playlist], description: "User Liked Playlists"})
  @ManyToMany(() => Playlist, {eager: false})
  @JoinTable({name: "playlist-likes"})
  likedPlaylists: Playlist[]

  //@ApiProperty({type: () => [Album], description: "User Albums"})
  @OneToMany(() => Album, (album) => album.owner, {eager: false})
  albums: Album[]

  //@ApiProperty({type: () => [Album], description: "User Liked Albums"})
  @ManyToMany(() => Album)
  @JoinTable({name: "album-likes"})
  likedAlbums: Album[]

  @ManyToMany(() => User)
  @JoinTable({name: "user-followers", joinColumn: {name: "userId"}, inverseJoinColumn: {name: "followerId"}})
  followers: User[]
}