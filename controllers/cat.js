/**
 * Created by trungquandev.com's author on 05/12/2018.
 * controllers/cat.js
 */
'use strict';

let uuid = require("uuid");
let Cat = require("../models/CatModel");

module.exports = {
  createCat: (event, context, callback) => {
    let body = JSON.parse(event.body); // Lấy các dữ liệu truyền lên từ body

    if (typeof body.name !== "string" || typeof body.kind !== "string") {
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          error: "The name & kind of cat must be string character.",
        })
      });
    }

    let catItem = {
      id: uuid.v1(),
      name: body.name,
      kind: body.kind,
    };

    // Lưu mèo vào database
    Cat.create(catItem, (err, catResult) => {
      if (err) {
        return callback(err);
      }
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: "Create cat sucessfully.",
          cat: catResult.get()
        })
      });
    });
  },
  getCatById: (event, context, callback) => {
    // Lấy id truyền lên từ url
    let catId = event.pathParameters.id;

    // Gọi mèo từ database
    Cat.getById(catId, (err, catResult) => {
      if (err) {
        return callback(err);
      }
      if (!catResult) {
        return callback(null, {
          statusCode: 404,
          body: JSON.stringify({
            error: "Cat not found!",
          })
        });
      }
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          cat: catResult.get()
        })
      });
    });
  },
  updateCatById: (event, context, callback) => {
    let catId = event.pathParameters.id;
    let body = JSON.parse(event.body);

    let catItem = {
      id: catId,
      name: body.name,
      kind: body.kind,
    };

    // Trong dự án thực tế thì hãy tìm con mèo trước, nếu tồn tại thì mới cho update.
    Cat.update(catItem, (err, catResult) => {
      if (err) {
        return callback(err);
      }
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: "Update cat sucessfully.",
          cat: catResult.get()
        })
      });
    });
  },
  deleteCatById: (event, context, callback) => {
    let catId = event.pathParameters.id;

    // Trong dự án thực tế thì hãy tìm con mèo trước, nếu tồn tại thì mới cho delete.
    Cat.deleteById(catId, (err) => {
      if (err) {
        return callback(err);
      }
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: "Delete cat sucessfully."
        })
      });
    });
  }
};
