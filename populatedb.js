const User = require("./models/user");
const Message = require("./models/message");

const users = [];
const messages = [];

async function populatedb() {
  await createUsers();
  await createMessages();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function userCreate(index, firstName, lastName, email, password, type) {
  const user = new User({
    first_name: firstName,
    last_name: lastName,
    username: email,
    password: password,
    status: type,
  });
  await user.save();
  users[index] = user;
  console.log(`Added user: ${email}`);
}

async function messageCreate(index, title, text, author) {
  const message = new Message({
    title,
    text,
    author,
  });

  await message.save();
  messages[index] = message;
  console.log(`Added message: ${title}`);
}

async function createUsers() {
  console.log("Adding users");
  await Promise.all([
    userCreate(
      0,
      "Ben",
      "Pemberton",
      "bennywenny@hooha.org",
      "verysecret",
      "Basic"
    ),
    userCreate(
      1,
      "Jack",
      "Pople",
      "jackywacky@hooha.org",
      "moresecret",
      "Admin"
    ),
    userCreate(
      2,
      "Sam",
      "Polge",
      "polgeywolgey@hooha.org",
      "topsecret",
      "Basic"
    ),
  ]);
}

async function createMessages() {
  console.log("Adding messages");
  await Promise.all([
    messageCreate(
      0,
      "A new message",
      "A post to display on this messageboard. Hopefully all users can see it. I am not sure what the rules are around permissions on this site.",
      users[0]._id
    ),
    messageCreate(
      0,
      "My big announcement",
      "Utterly delighted to be able to say my piece on this here interwebby thing. I expect you will all be singing my praises soon enough and if it turns out that that does not happen, then i think we can safely assume that you are emotionally and spiritually disturbed.",
      users[1]._id
    ),
    messageCreate(
      0,
      "What is happening here?",
      "Could someone clarify what the point of all this is? I would feel more comfortable using this service if I knew to what end we are scribbling down messages.",
      users[2]._id
    ),
  ]);
}

module.exports = populatedb;
