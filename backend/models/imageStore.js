const createDate = value => new Date(value);

const images = [
  {
    id: "1",
    title: "晨霧山林",
    description: "清晨的薄霧包圍山林，靜謐而迷人。",
    url: "https://picsum.photos/seed/mountains/800/500",
    views: 134,
    likes: 18,
    createdAt: createDate("2023-11-28T06:30:00Z"),
    comments: [
      {
        id: "c1",
        imageId: "1",
        name: "Lina",
        email: "lina@example.com",
        text: "喜歡這張照片的光線。",
        createdAt: createDate("2023-11-29T08:15:00Z")
      },
      {
        id: "c2",
        imageId: "1",
        name: "Ken",
        email: "ken@example.com",
        text: "有種親臨現場的感覺。",
        createdAt: createDate("2023-11-30T11:42:00Z")
      }
    ]
  },
  {
    id: "2",
    title: "夜色城市",
    description: "城市夜晚的燈光與倒影相互輝映。",
    url: "https://picsum.photos/seed/city/800/500",
    views: 210,
    likes: 27,
    createdAt: createDate("2023-11-27T14:20:00Z"),
    comments: [
      {
        id: "c3",
        imageId: "2",
        name: "Joan",
        email: "joan@example.com",
        text: "色彩很迷人。",
        createdAt: createDate("2023-11-28T18:09:00Z")
      }
    ]
  },
  {
    id: "3",
    title: "海邊日落",
    description: "日落時分的海邊，天空染上暖橘色。",
    url: "https://picsum.photos/seed/beach/800/500",
    views: 178,
    likes: 22,
    createdAt: createDate("2023-11-26T09:10:00Z"),
    comments: [
      {
        id: "c4",
        imageId: "3",
        name: "Milo",
        email: "milo@example.com",
        text: "海浪的線條很優美。",
        createdAt: createDate("2023-11-27T07:55:00Z")
      }
    ]
  },
  {
    id: "4",
    title: "森林小徑",
    description: "被高大樹木包圍的森林小徑。",
    url: "https://picsum.photos/seed/forest/800/500",
    views: 96,
    likes: 12,
    createdAt: createDate("2023-11-25T13:45:00Z"),
    comments: []
  }
];

let nextImageId = images.length + 1;
let nextCommentId = images.reduce((total, image) => total + image.comments.length, 0) + 1;

const cloneComment = comment => ({
  ...comment,
  createdAt: new Date(comment.createdAt)
});

const cloneImage = image => ({
  ...image,
  createdAt: new Date(image.createdAt),
  comments: image.comments.map(cloneComment)
});

const getLatestImages = (limit = 6) =>
  images
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit)
    .map(cloneImage);

const getImageById = id => {
  const image = images.find(item => item.id === id);
  if (!image) {
    return null;
  }
  return cloneImage(image);
};

const addImage = ({ title, description, url }) => {
  const trimmedTitle = title ? title.trim() : "";
  const trimmedDescription = description ? description.trim() : "";
  const trimmedUrl = url ? url.trim() : "";
  const newImage = {
    id: String(nextImageId++),
    title: trimmedTitle,
    description: trimmedDescription,
    url: trimmedUrl,
    views: 0,
    likes: 0,
    createdAt: new Date(),
    comments: []
  };
  images.unshift(newImage);
  return cloneImage(newImage);
};

const increaseViews = id => {
  const image = images.find(item => item.id === id);
  if (!image) {
    return null;
  }
  image.views += 1;
  return cloneImage(image);
};

const likeImage = id => {
  const image = images.find(item => item.id === id);
  if (!image) {
    return null;
  }
  image.likes += 1;
  return cloneImage(image);
};

const addComment = (imageId, { name, email, text }) => {
  const image = images.find(item => item.id === imageId);
  if (!image) {
    return null;
  }
  const comment = {
    id: `c${nextCommentId++}`,
    imageId,
    name: name && name.trim() ? name.trim() : "訪客",
    email: email && email.trim() ? email.trim() : "",
    text: text.trim(),
    createdAt: new Date()
  };
  image.comments.unshift(comment);
  return cloneComment(comment);
};

const getTotals = () => {
  const totals = images.reduce(
    (acc, image) => {
      acc.comments += image.comments.length;
      acc.views += image.views;
      acc.likes += image.likes;
      return acc;
    },
    { images: images.length, comments: 0, views: 0, likes: 0 }
  );
  return { ...totals };
};

const getRecentComments = (limit = 5) => {
  const allComments = images.flatMap(image =>
    image.comments.map(comment => ({
      ...comment,
      imageTitle: image.title
    }))
  );
  return allComments
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit)
    .map(comment => ({
      ...comment,
      createdAt: new Date(comment.createdAt)
    }));
};

module.exports = {
  getLatestImages,
  getImageById,
  addImage,
  increaseViews,
  likeImage,
  addComment,
  getTotals,
  getRecentComments
};
