// ts -> .d.ts 翻译文件 @types/superagent -> js
import superagent from "superagent";
import fs from "fs";
import path from "path";

import DellAnalyzer from "./analyzer";

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crowller {
  private filePath = path.resolve(__dirname, "../../data/course.json");

  private async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }

  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  private async initSpiderProcess() {
    const html = await this.getRawHtml();
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }
  constructor(private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess();
  }
}

const url = `http://www.dell-lee.com`;

const analyzer =  DellAnalyzer.getInstance();

const crowller = new Crowller(url, analyzer);


export default Crowller