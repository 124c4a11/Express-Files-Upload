import { injectable } from 'inversify';
import { IFilesService } from './files.service.interface';

@injectable()
export class FilesService implements IFilesService {
  async upload(): Promise<any> {
    return 'UploadService';
  }
}
