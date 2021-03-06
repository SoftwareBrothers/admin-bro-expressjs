import AdminJS from "adminjs";
import express from "express";
import mongoose from "mongoose";
import MongooseAdapter from "@adminjs/mongoose";
import AdminJSExpress from "../src";

import "./mongoose/article-model";
import "./mongoose/admin-model";

AdminJS.registerAdapter(MongooseAdapter);

const ADMIN = {
  email: "test@example.com",
  password: "password",
};

const start = async () => {
  const connection = await mongoose.connect(
    process.env.MONGO_URL || "mongodb://localhost:27017/example"
  );
  const app = express();

  const adminJs = new AdminJS({
    databases: [connection],
    rootPath: "/admin",
  });

  const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (email, password) => {
      if (ADMIN.password === password && ADMIN.email === email) {
        return ADMIN;
      }
      return null;
    },
    cookiePassword: "somasd1nda0asssjsdhb21uy3g",
  });

  app.use(adminJs.options.rootPath, router);

  app.listen(process.env.PORT || 8080, () =>
    console.log("AdminJS is running under localhost:8080/admin")
  );
};

start();
