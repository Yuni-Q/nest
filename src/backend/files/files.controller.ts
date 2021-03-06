import { Controller, Delete, Get, HttpStatus, Post, Put, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Id } from 'src/backend/common/decorators/id.decorator';
import { ImageUploaderLiveName } from 'src/backend/common/decorators/image-uploade-live-name.decorator';
import { CustomInternalServerErrorException } from 'src/backend/common/exception/custom.interval.server.error.exception';
import { RequireBodyException } from 'src/backend/common/exception/require.body.exception';
import { TransformInterceptor } from 'src/backend/common/interceptors/transformInterceptor.interceptor';

import { DeleteFileDto } from './dto/delete-file.dto';
import { FileBodyDto } from './dto/file-body.dto';
import { FileDto } from './dto/file.dto';
import { FilesDto } from './dto/files.dto';
import { FilesService } from './files.service';

@UseInterceptors(TransformInterceptor)
@ApiTags('files')
@Controller('api/v1/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: FilesDto,
    description: '성공',
  })
  @Get()
  async getAllFiles(): Promise<FilesDto> {
    try {
      const files = await this.filesService.getAllFiles();
      // await Promise.all(
      //   files.map(async (f) => {
      //     const ss = f.cardUrl.split('parts/');
      //     f.cardPdfUrl = ss[0] + 'parts/headless/' + ss[1];
      //     await this.filesService.updateFile(f);
      //   }),
      // );
      return { data: files };
    } catch (error) {
      throw new CustomInternalServerErrorException(error.message, error.status, error.statusCode);
    }
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FileDto,
    description: '성공',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        part: {
          type: 'string',
          format: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  async createFile(@ImageUploaderLiveName() body: FileBodyDto): Promise<FileDto> {
    try {
      // TODO svg와 png도 함께 올리기
      const { file: cardUrl, part: partString } = body;
      if (!cardUrl || !partString) {
        throw new RequireBodyException();
      }
      const part = partString ? parseInt(partString, 10) : parseInt(cardUrl.split('.pdf')[0].split('_').pop(), 10);
      if (isNaN(part)) {
        throw new RequireBodyException();
      }
      const result = await this.filesService.create({ cardUrl, part });
      return { statusCode: HttpStatus.CREATED, data: result };
    } catch (error) {
      throw new CustomInternalServerErrorException(error.message, error.status, error.statusCode);
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: FileDto,
    description: '성공',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        part: {
          type: 'string',
          format: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id',
  })
  @Put(':id/svg')
  async updateSvg(@ImageUploaderLiveName() body: FileBodyDto, @Id() id: number): Promise<FileDto> {
    try {
      const { file: cardSvgUrl, part: partString } = body;
      if (!cardSvgUrl || !partString) {
        throw new RequireBodyException();
      }
      const part = partString ? parseInt(partString, 10) : parseInt(cardSvgUrl.split('.pdf')[0].split('_').pop(), 10);
      if (isNaN(part)) {
        throw new RequireBodyException();
      }
      const file = await this.filesService.checkFile({ id });
      const returnFile = await this.filesService.updateFile({
        ...file,
        cardSvgUrl,
        part,
      });
      return { data: returnFile };
    } catch (error) {
      throw new CustomInternalServerErrorException(error.message, error.status, error.statusCode);
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: FileDto,
    description: '성공',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        part: {
          type: 'string',
          format: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id',
  })
  @Put(':id')
  async updatePdf(@ImageUploaderLiveName() body: FileBodyDto, @Id() id: number): Promise<FileDto> {
    try {
      const { file: cardUrl, part: partString } = body;
      if (!cardUrl || !partString) {
        throw new RequireBodyException();
      }
      const part = partString ? parseInt(partString, 10) : parseInt(cardUrl.split('.pdf')[0].split('_').pop(), 10);
      if (isNaN(part)) {
        throw new RequireBodyException();
      }
      const file = await this.filesService.checkFile({ id });
      const returnFile = await this.filesService.updateFile({
        ...file,
        cardUrl,
        part,
      });
      return { data: returnFile };
    } catch (error) {
      throw new CustomInternalServerErrorException(error.message, error.status, error.statusCode);
    }
  }

  @ApiResponse({
    status: new DeleteFileDto().status,
    type: DeleteFileDto,
    description: new DeleteFileDto().message,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id',
  })
  @Delete(':id')
  async destroy(@Id() id: number): Promise<DeleteFileDto> {
    try {
      const file = await this.filesService.checkFile({ id });
      await this.filesService.deleteFile(file);
      return { data: null, message: new DeleteFileDto().message };
    } catch (error) {
      throw new CustomInternalServerErrorException(error.message, error.status, error.statusCode);
    }
  }
}
