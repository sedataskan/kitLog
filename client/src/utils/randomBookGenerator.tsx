const randomWords = [
  "Life",
  "Journey",
  "Dreams",
  "Future",
  "Shadows",
  "Light",
  "Hope",
  "Secrets",
  "Adventures",
  "Whispers",
  "Stars",
  "Destiny",
  "Legacy",
];

const randomAdjectives = [
  "Lost",
  "Brilliant",
  "Silent",
  "Hidden",
  "Forgotten",
  "Unseen",
  "Mysterious",
  "Eternal",
  "Fleeting",
  "Golden",
  "Dark",
  "Bright",
];

const firstNames = [
  "Emma",
  "Liam",
  "Noah",
  "Sophia",
  "Oliver",
  "Amelia",
  "Elijah",
  "Isabella",
  "James",
  "Mia",
  "Benjamin",
  "Charlotte",
  "Lucas",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Martinez",
  "Davis",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
];

const coverImages = [
  "https://m.media-amazon.com/images/I/61eoeu1UpRL._AC_UF1000,1000_QL80_.jpg",
  "https://m.media-amazon.com/images/I/61+2FD3Kc-L.jpg",
  "https://m.media-amazon.com/images/I/61lk8swYw9L._AC_UF1000,1000_QL80_.jpg",
  "https://mir-s3-cdn-cf.behance.net/project_modules/disp/d0170d28045073.5636ec4991632.jpg",
  "https://m.media-amazon.com/images/I/71un2hI4mcL.jpg",
  "https://m.media-amazon.com/images/I/81pCZrM-GcL._AC_UF894,1000_QL80_.jpg",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4812dd22-9ac1-421f-a20d-9791bfe49b64/deylmwf-a9aca9ad-316a-41a8-ab99-cc383433677c.png/v1/fit/w_414,h_600/schwi_and_riku___ngnl_zero_render_by_minou_noire_deylmwf-414w.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTM2OSIsInBhdGgiOiJcL2ZcLzQ4MTJkZDIyLTlhYzEtNDIxZi1hMjBkLTk3OTFiZmU0OWI2NFwvZGV5bG13Zi1hOWFjYTlhZC0zMTZhLTQxYTgtYWI5OS1jYzM4MzQzMzY3N2MucG5nIiwid2lkdGgiOiI8PTk0NSJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.lRqIF8cCKQ1JXBRC4FE1j9BjVqaKKNFnFpY6wAYZ0Z0",
  "https://i.pinimg.com/736x/5a/ca/d3/5acad3bf86254e033a722526be5043d8.jpg",
  "https://m.media-amazon.com/images/I/71y4X5150dL._AC_UF1000,1000_QL80_.jpg",
  "https://danbrown.com/wp-content/themes/danbrown/images/db/books.03.jpg",
];

function getRandomElement(array: string[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateRandomBook() {
  const title = `The ${getRandomElement(randomAdjectives)} ${getRandomElement(
    randomWords
  )}`;
  const author = `${getRandomElement(firstNames)} ${getRandomElement(
    lastNames
  )}`;
  const coverImage = getRandomElement(coverImages);
  return { title, author, coverImage };
}
