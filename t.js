const fs = require("fs");
const path = require("path");
const axios = require("axios");
const slugify = require("slugify");

const sleep = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
};

const source = {
  "en-US": ["Racing", "Casual", "Skill", "Animal", "Girls"],
  "ja-JP": ["レース", "カジュアル", "スキル", "動物", "女の子"], // 日语
  "de-DE": ["Rennspiele", "Gelegenheitsspiele", "Fähigkeit", "Tier", "Mädchen"], // 德语
  "fr-FR": ["Courses", "Décontracté", "Compétence", "Animal", "Filles"], // 法语
  "ko-KR": ["경주", "캐주얼", "기술", "동물", "소녀"], // 韩语
  "es-ES": ["Carreras", "Casual", "Habilidad", "Animal", "Chicas"], // 西班牙语
  "pt-BR": ["Corrida", "Casual", "Habilidade", "Animal", "Meninas"], // 葡语
};

const generateCategories = async () => {
  for (const locale in source) {
    const categories = source[locale].map((item, index) => ({
      id: index + 1,
      name: item,
      alias: slugify(source["en-US"][index], {
        replacement: "-", // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: true, // strip special characters except replacement, defaults to `false`
        trim: true,
      }),
    }));
    fs.writeFileSync(
      `./data/${locale}/categories.json`,
      JSON.stringify(categories, null, 2),
      {
        encoding: "utf-8",
      }
    );
  }
};

const generateGamesData = async () => {
  const resource = fs.readFileSync("./resource/merge-data.json");
  const parseResource = JSON.parse(resource);
  const names = [];
  const tempData = [];
  for (let sliceData of parseResource) {
    const { category, data: categoryByGames } = sliceData;

    let categoryId = source["en-US"].findIndex((item) => item === category) + 1;
    if (categoryId) {
      for (const game of categoryByGames) {
        const { imgurl } = game;
        let slug = slugify(game.imgname, {
          replacement: "-", // replace spaces with replacement character, defaults to `-`
          remove: undefined, // remove characters that match regex, defaults to `undefined`
          lower: true, // convert to lower case, defaults to `false`
          strict: true, // strip special characters except replacement, defaults to `false`
          trim: true,
        });
        if (names.includes(slug)) {
          slug = `${slug}${names.filter((item) => item === slug).length}`;
        }
        names.push(slug);
        const extname = path.extname(imgurl);
        await axios
          .get(`https://gamebuckets.com${imgurl}`, {
            responseType: "arraybuffer",
          })
          .then(({ data }) => {
            fs.writeFileSync(
              `./public/static/images/games/${slug}${extname}`,
              data
            );
          });
  
        tempData.push({
          id: tempData.length + 1,
          name: game.imgname,
          description: game.imgdesc,
          image: `/static/images/games/${slug}${extname}`,
          gameUrl: game.imgpath,
          categoryId: categoryId,
          slug,
          likes: game.star
        });
      }
    }
    
  }
  for (const locale in source) {
    fs.writeFileSync(
      `./data/${locale}/data.json`,
      JSON.stringify(tempData, null, 2),
      {
        encoding: "utf-8",
      }
    );
  }
};

const mergeData = () => {
  const resource = fs.readFileSync("./resource/data.json");
  const parseResource = JSON.parse(resource);
  const resource2 = fs.readFileSync("./resource/data2.json");
  const parseResource2 = JSON.parse(resource2);

  const destData = parseResource.reduce((results, item) => {
    const { category, data } = item;
    const otherGames = parseResource2.find(
      (findItem) => findItem.category === category
    );

    if (otherGames) {
      return [
        ...results,
        {
          category,
          data: [...data, ...otherGames.data],
        },
      ];
    }
    return [
      ...results,
      {
        ...item,
      },
    ];
  }, []);

  fs.writeFileSync(
    "./resource/merge-data.json",
    JSON.stringify(destData, null, 2),
    {
      encoding: "utf-8",
    }
  );
};

const generateI18nGames = async () => {
  const i18nSource = fs.readFileSync("./data/source.json");
  const parseI18nSource = JSON.parse(i18nSource);

  for (const locale in source) {
    if (locale !== "en-US") {
      const lang = locale.split("-")[0];
      const localeSource = fs.readFileSync(`./data/${locale}/data.json`);
      const parseLocaleSource = JSON.parse(localeSource);
      const destData = parseLocaleSource.map((item) => {
        const i18nInfo = parseI18nSource[item.slug][lang];
        return {
          ...item,
          name: i18nInfo.name,
          description: i18nInfo.description,
        };
      });
      fs.writeFileSync(
        `./data/${locale}/data.json`,
        JSON.stringify(destData, null, 2),
        {
          encoding: "utf-8",
        }
      );
    }
  }
};

// handler();

// generateGamesData();

generateI18nGames();
// mergeData();

// generateCategories();
