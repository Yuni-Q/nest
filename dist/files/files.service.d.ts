import { File } from 'src/common/entity/File.entity';
import { Repository } from 'typeorm';
export declare class FilesService {
    private fileRepository;
    constructor(fileRepository: Repository<File>);
    getFileByPart(part: number): Promise<File>;
    deleteFile(file: File): Promise<File>;
    updateFile(body: any): Promise<File>;
    create(body: any): Promise<File>;
    checkFile({ id }: {
        id: number;
    }): Promise<File>;
}
