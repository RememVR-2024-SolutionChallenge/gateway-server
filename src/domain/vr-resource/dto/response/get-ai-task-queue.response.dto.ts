import { ApiProperty } from '@nestjs/swagger';
import { AiTaskRequest } from '../../../sample/document/ai-task-request.document';

export class GetAiTaskQueueResponseDto {
  @ApiProperty({ description: '타입', example: 'scene' })
  type: 'scene' | 'avatar';

  @ApiProperty({ description: '상태', example: 'waiting' })
  status: 'pending' | 'processing' | 'failed';

  @ApiProperty({ description: '제목', example: '아들' })
  title: string;

  static of(task: AiTaskRequest): GetAiTaskQueueResponseDto {
    const response = new GetAiTaskQueueResponseDto();
    response.type = task.type;
    if (task.status !== 'completed') response.status = task.status;
    response.title = task.title;
    return response;
  }
}
