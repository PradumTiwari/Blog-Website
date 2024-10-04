import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import * as dotenv from 'dotenv';
dotenv.config();
const app = new Hono()
const prisma=new PrismaClient({
  datasourceUrl:process.env.DATABASE_URL,
}).$extends(withAccelerate())
/* 1. POST `/api/v1/signup`
2. POST `/api/v1/signin`
3. POST `/api/v1/blog`
4. PUT `/api/v1/blog`
5. GET `/api/v1/blog/:id`*/ 

app.post("/api/v1/blog",(c)=>{
   return c.text('signin route');
})
app.post("/api/v1/signup",async(c)=>{
  const body=await c.req.json();
  try {
    const user=await prisma.user.create({
      data:{
        email:body.email,
        password:body.password
      }
    }) 
    return c.text('signup route');
  }
  catch(e){
    return c.status(403);
  }
   

});

app.get("/api/v1/blog/:id",(c)=>{
  const id=c.req.param('id');
  console.log(id);
  return c.text('get blog route');
})

app.post("/api/v1/blog",(c)=>{
  return c.text('signin route');
})

app.put('/api/v1/blog', (c) => {
  return c.text('Signin route');
})

export default app;

