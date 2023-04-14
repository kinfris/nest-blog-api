import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { PostsService } from '../../posts/posts.service';

@ValidatorConstraint({
  name: 'IsBlogExist',
  async: true,
})
@Injectable()
export class IsBlogExistValidator implements ValidatorConstraintInterface {
  constructor(@Inject(PostsService) private postsService: PostsService) {}

  async validate(value: any): Promise<boolean> {
    const blog = await this.postsService.findBlogByIdForValidation(value);
    return !!blog;
  }

  defaultMessage() {
    return 'Blog with this id is not exist';
  }
}
