import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import * as dotenv from 'dotenv';
import { sign } from 'hono/jwt';
dotenv.config();
const app = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string,
  }
}>();

/* 1. POST `/api/v1/signup`
2. POST `/api/v1/signin`
3. POST `/api/v1/blog`
4. PUT `/api/v1/blog`
5. GET `/api/v1/blog/:id`*/ 

app.post("/api/v1/signin",async(c)=>{
  const prisma=new PrismaClient({
    datasourceUrl:c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const body=await c.req.json();
  const user=await prisma.user.findUnique({
    where:{
      email:body.email,
    }
  })
  if(!user){
    c.status(403);
    return c.json({error:"User Not found"});
  }

  const jwt=await sign({id:user.id},c.env.JWT_SECRET);
   return c.json({jwt});
})
app.post("/api/v1/signup",async(c)=>{
  const body=await c.req.json();
  try {
    const prisma=new PrismaClient({
      datasourceUrl:c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const user=await prisma.user.create({
      data:{
        email:body.email,
        password:body.password
      }
    }) 
    const jwt=await sign({id:user.id},c.env.JWT_SECRET);
    return c.json({jwt});
  }
  catch(e){
     c.status(403);
     return c.json({error:"error while signing up"});
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

