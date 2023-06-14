import { injectable } from 'inversify';
import { format } from 'date-fns';
import { path as rootPath } from 'app-root-path';
import fs from 'fs-extra';
import sharp from 'sharp';
import { FileResponseDto } from '../dto/file-response.dto';
import { IFilesService } from './files.service.interface';
import { FileEntity } from '../file.entity';

const uploadDirPath = `${rootPath}/uploads`;

@injectable()
export class FilesService implements IFilesService {
  async upload(files: Express.Multer.File[]): Promise<FileResponseDto[]> {
    const dateFolder = format(new Date(), 'yyy-MM-dd');
    const uploadFolder = `${uploadDirPath}/${dateFolder}`;
    const result: FileResponseDto[] = [];

    await fs.ensureDir(uploadFolder);

    for (const file of files) {
      let newFile = null;

      if (file.mimetype.includes('image')) {
        const buffer = await this.convertToWebP(file.buffer);

        newFile = new FileEntity({
          originalname: `${file.originalname.split('.')[0]}_${Date.now()}.webp`,
          buffer,
        });
      } else {
        newFile = new FileEntity(file);
      }

      await fs.writeFile(`${uploadFolder}/${newFile.originalname}`, newFile.buffer);

      result.push({ url: `${dateFolder}/${newFile.originalname}`, name: newFile.originalname });
    }

    return result;
  }

  async delete(path: string): Promise<boolean> {
    await fs.remove(`${uploadDirPath}/${path}`);

    const imageDir = `${uploadDirPath}/${path.split('/')[0]}`;
    const isEmptyDir = !(await fs.readdir(imageDir)).length;

    if (isEmptyDir) await fs.remove(imageDir);

    return true;
  }

  async convertToWebP(file: Buffer): Promise<Buffer> {
    return await sharp(file).webp().toBuffer();
  }
}
