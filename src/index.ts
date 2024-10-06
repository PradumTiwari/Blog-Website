import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign, verify } from 'hono/jwt';
import { userRouter } from './routes/user'; 
import {blogRouter} from './routes/blog';
import { signinInput, signupInput, createPostInput, updatePostInput } from "ayush_suwar";

type Variables={
  userId:string,
}
const app = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string,
  },
  Variables:Variables,
}>();



app.route('/api/v1/user',userRouter);
app.route('/api/v1/book',blogRouter);

/* 1. POST `/api/v1/signup`
2. POST `/api/v1/signin`
3. POST `/api/v1/blog`
4. PUT `/api/v1/blog`
5. GET `/api/v1/blog/:id`*/ 


app.use('/api/v1/blog/*', async (c, next) => {
  const jwt = c.req.header('Authorization');
  if (!jwt) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
  
  const token = jwt.split(' ')[1];
  const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
  
  // Set the userId in c.variables instead of c.set
  c.set('userId', payload.id);
  await next();
});

app.get('/',(c)=>{
 return c.json('H')
})




app.get("/api/v1/blog/:id",async(c)=>{
  const id=c.req.param('id');
  const prisma=new PrismaClient({
    datasourceUrl:c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog=await prisma.post.findUnique({
    where:{
      id:id,
    }
  })
  return c.json(blog);
})

app.post("/api/v1/blog",async(c)=>{
  const userId = c.get('userId');
  const prisma=new PrismaClient({
    datasourceUrl:c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body=await c.req.json();
  const {success}=createPostInput.safeParse(body);
  if(!success){
    c.status(400);
    return c.json({error:"Invalid Input"});
  }
  const post=await prisma.post.create({
    data:{
      title:body.title,
      Content:body.content,
      authorId:userId,
    }
  })
  return c.json({
    id:post.id,
  });
})

app.put('/api/v1/blog', async(c) => {
  const userId=c.get('userId');
  const prisma=new PrismaClient({
    datasourceUrl:c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body=await c.req.json();
  const {success}=updatePostInput.safeParse(body);
  if(!success){
    c.status(400);
    return c.json({error:"Invalid Input"});
  }
  prisma.post.update({
    where:{
      id:body.id,
      authorId:userId,
    },
    data:{
      title:body.title,
      Content:body.content,
    }
  })
return c.text("Post Updated");
})

export default app;

