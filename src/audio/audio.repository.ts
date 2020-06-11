import {EntityRepository, Repository} from 'typeorm'
import {AudioFile} from './audio.entity'

@EntityRepository(AudioFile)
export class AudioRepository extends Repository<AudioFile> {}
