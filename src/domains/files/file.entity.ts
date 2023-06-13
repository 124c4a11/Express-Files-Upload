export class FileEntity {
  originalname: string;
  buffer: Buffer;

  constructor(file: Express.Multer.File | FileEntity) {
    this.originalname = file.originalname;
    this.buffer = file.buffer;
  }
}
