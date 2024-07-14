const fs = require("fs");
const multer =require("multer")

exports.uploadFile = () => {
    try {
      const now = Date.now();
  
      const localStorage = multer.diskStorage({
        destination: function (req, file, cb) {
          let folderName=file?.fieldname
          let dir = `public/assets/${folderName}`;
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          cb(null, dir);
        },
        
        filename: function (req, file, cb) {
          cb(null, `${now}-${file.fieldname}-${file.originalname}`);
        },
        
      });
  
      const uploadLocal = multer({
         storage: localStorage,
         limits: {
         fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
         },
        //  fileFilter: (req, file, cb) => {
        //      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        //          cb(null, true);
        //      } else {
        //          return cb(new Error('File type not supported'), false);
        //      }
        //  }
      });

    const singleUpload = (fieldName) => {
        const upload = uploadLocal.single(fieldName);
      
        return async (req, res, next) => {
            upload(req, res, (err) => {
              if (err) {
                console.error(`Error in single file upload: ${err}`);
                return next(err);
              }
              if (!req?.file) {
                if (err instanceof multer.MulterError && err.code === "LIMIT_UNEXPECTED_FILE") {
                    console.error(`MulterError: Unexpected field - ${err.field}`);
                    return res.status(400).send({ error: "Unexpected field in file upload" });
                }
                console.log(`No file found for field: ${fieldName}`);
                return next();
              }
              next();
            });
        };
      };
      
      //multipleUpload in that case single field multiple image take a field name and maxcount
      const multipleUpload = (fieldName,maxCount) => {
        return (req, res, next) => {
          const upload = uploadLocal.array(fieldName,maxCount);
          upload(req, res, (err) => {
            if (err) {
                if (err instanceof multer.MulterError && err.code === "LIMIT_UNEXPECTED_FILE") {
                    console.error(`MulterError: Unexpected field - ${err.field}`);
                    return res.status(400).send({ error: "Unexpected field in file upload" });
                }
                console.error(`Error in multiple file upload: ${err}`);
                return next(err);
            }
            if (!req?.files) {
                console.log(`No file found for field: ${fieldName}`);
                return next();
            }
            next();
          });
        };
      };


      const multipleFields = (fieldarray) => {
    
        // [
        //   { name: 'fieldOne' },
        //   { name: 'fieldTwo' },
        //   // Add more field names as needed
        // ]
        return (req, res, next) => {
          const upload = uploadLocal.fields(fieldarray);
          upload(req, res, (err) => {
            if (err) {// Handle unexpected field error
                if (err instanceof multer.MulterError && err.code === "LIMIT_UNEXPECTED_FILE") {
                    console.error(`MulterError: Unexpected field - ${err.field}`);
                    return res.status(400).send({ error: "Unexpected field in file upload" });
                }
              console.error(`Error in multiple fields upload: ${err}`);
              return next(err);
            }
            if (!req?.files) {
                console.log(`No file found for field: ${JSON.stringify(fieldarray)}`);
                return next();
            }
            next();
          });
        };
      };
      return {
        singleUpload,
        multipleUpload,
        multipleFields
      };
    } catch (error) {
      console.error(`Upload setup error: ${error}`);
    }
  };