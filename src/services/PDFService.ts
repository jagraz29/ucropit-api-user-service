import { v4 as uuidv4 } from 'uuid';
import Handlebars from 'handlebars';
import Puppeteer from 'puppeteer';
import sha256 from 'sha256';
import {
  makeDirIfNotExists,
  readFileBytes,
  saveFile,
  readFile,
} from '../utils';
import { FileDocumentRepository } from '../repositories';
import { setScriptPdf } from '../helpers';
import { FileDocumentProps } from '../interfaces';

export class PDFService {
  public static async generatePdf(
    nameTemplate: string,
    context: object,
    directory: string,
    nameFile: string,
    { _id: cropId }
  ): Promise<string | null> {
    const fileDocuments: FileDocumentProps | null =
      await FileDocumentRepository.getFiles(cropId);

    const path: string = `public/uploads/${directory}/`;
    await makeDirIfNotExists(path);
    const fullName: string = `${nameFile}-${uuidv4()}.pdf`;
    const pathFile: string = `${path}${fullName}`;

    const hbs: string = readFile(`views/pdf/html/${nameTemplate}.hbs`);
    const handlebarsWithScript = setScriptPdf(Handlebars);
    const template = handlebarsWithScript.compile(hbs);
    const html = template(context, 'utf-8');
    saveFile(`public/uploads/${directory}/content.html`, html);
    // console.log(html);

    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.addStyleTag({ path: `views/pdf/css/${nameTemplate}.css` });
    await page.emulateMediaType('screen');
    const pdfBytes = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        left: '20px',
        top: '20px',
        right: '20px',
        bottom: '20px',
      },
    });

    if (!fileDocuments) {
      saveFile(pathFile, pdfBytes);
      await FileDocumentRepository.createFile({
        nameFile: fullName,
        path: pathFile,
        date: new Date(),
        cropId,
      });
      return fullName;
    }

    return this.findAndSavePdfExists(
      directory,
      fullName,
      fileDocuments,
      cropId,
      pdfBytes
    );
  }

  private static async findAndSavePdfExists(
    directory: string,
    fullName: string,
    { nameFile }: FileDocumentProps,
    cropId,
    pdfBytes
  ) {
    const pathFile = `public/uploads/${directory}/`;
    const oldPdfBytes = readFileBytes(`${pathFile}${nameFile}`);
    if (oldPdfBytes) {
      // console.log(sha256(pdfBytes),sha256(oldPdfBytes))
      if (sha256(pdfBytes) === sha256(oldPdfBytes)) {
        return nameFile;
      }
    }
    saveFile(`${pathFile}${fullName}`, pdfBytes);
    await FileDocumentRepository.createFile({
      nameFile: fullName,
      path: `${pathFile}${fullName}`,
      date: new Date(),
      cropId,
    });
    return fullName;
  }
}
