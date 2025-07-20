import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { PostsService } from './posts.service';

@Processor('post-queue')
export class PostsProcessor {
  constructor(private readonly postsService: PostsService) {}

  @Process('create-post')
  async handleCreatePost(job: Job) {
    console.log('Processing post creation job:', job.data);
    
    const result = await this.postsService.processPostCreation(job.data);
    
    console.log('Post created successfully:', result);
    
    return result;
  }
} 