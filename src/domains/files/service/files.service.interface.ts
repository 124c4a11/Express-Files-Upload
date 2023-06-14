import { FileResponseDto } from '../dto/file-response.dto';

export interface IFilesService {
  upload: (files: Express.Multer.File[]) => Promise<FileResponseDto[]>;
  delete: (path: string) => Promise<boolean>;
}
