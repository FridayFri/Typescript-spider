import { Router, Request, Response, NextFunction } from "express";
import Crowller from "./utils/crowller";
import Analyzer from "./utils/analyzer";
import fs from "fs";
import path from "path";
import { getResponseData } from "./utils/util";

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}
const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, '请先登录'));
  }
};


const router = Router();

router.get("/", (req: Request, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.send(`
      <html>
        <body>
          <a href='/getData'>爬取内容</a>
          <a href='/showData'>展示内容</a>
          <a href='/logout'>退出</a>
        </body>
      </html>
    `);
  } else {
    res.send(`
      <html>
        <body>
          <form method="post" action="/login">
            <input type="password" name="password" />
            <button>登陆</button>
          </form>
        </body>
      </html>
    `);
  }
});

router.get("/logout", (req: Request, res: Response) => {
  if (req.session) {
    req.session.login = undefined;
  }
  res.redirect("/");
});

router.post("/login", (req: BodyRequest, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.send("已经登陆过");
  } else {
    if (password === "123" && req.session) {
      req.session.login = true;
      res.send("登陆成功");
    } else {
      res.send("登陆失败");
    }
  }
});

router.get("/getData", checkLogin, (req: BodyRequest, res: Response) => {
  const url = `http://www.dell-lee.com`;
    const analyzer = Analyzer.getInstance();
    new Crowller(url, analyzer);
    res.send(" getData");
  res.json(getResponseData(true));
});

router.get("/showData", checkLogin, (req: BodyRequest, res: Response) => {
  try {
    const position = path.resolve(__dirname, "../data/course.json");
    const result = fs.readFileSync(position, "utf8");
    res.json(getResponseData(JSON.parse(result)));
  } catch (e) {
    res.json(getResponseData(false, "数据不存在"));
  }
});

export default router;
