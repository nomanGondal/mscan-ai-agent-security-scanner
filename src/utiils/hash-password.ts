import bcrypt from "bcrypt"

async function run() {
  const password = "123456"
  const hash = await bcrypt.hash(password, 10)
  console.log("Hashed password:", hash)
}

run()
