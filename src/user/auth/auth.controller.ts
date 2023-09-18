// import { UserType } from '@prisma/client';
import { Controller, Post, Get, Body, Param, ParseEnumPipe, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto, GenerateProductKeyDto } from './dto/auth.dto';
import { UserType } from '@prisma/client';
//import { AuthService } from './auth.service';
import * as bcrypt from "bcryptjs";
import { User, UserInfo } from 'src/user/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/signup/:userType')
  async signup(@Body() body: SignupDto,
  @Param('userType', new ParseEnumPipe(UserType)) userType:UserType) {
    
    if(userType!==UserType.BUYER){
      if(!body.productKey){
        throw new UnauthorizedException()
      }

      const validProductKey=`${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`
      const isValidProductKey= await bcrypt.compare(validProductKey,body.productKey)
      if(!isValidProductKey){
         throw new UnauthorizedException()
      }
      

    }
    return this.authService.signup(body,userType);
  }
  @Post("/signin")
  signin(@Body() body: SigninDto){
    return this.authService.signin(body);
  }

  @Post("/key")
  generateProductkey(@Body() {userType,email}: GenerateProductKeyDto){
    return this.authService.generateProductKey(email,userType);
  }

  @Get("/me")
  me( @User() user: UserInfo ) {
    return user;
  }

}



//   constructor(public authService: AuthService) {}

//   @Post('/signup/:userType') 
//   async signup(@Body() body: SignupDto, @Param('userType', new ParseEnumPipe(UserType)) userType: UserType
//   ) {

//     if(userType !== UserType.BUYER) {
//       if(!body.productKey) {
//         throw new UnauthorizedException()
//       }

//       const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`

//       const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey);
      
//       if(!isValidProductKey) throw new UnauthorizedException()
//     }
      
//     return this.authService.signup(body, userType);

//   @Post('/signin')
  // signin(@Body() body: SigninDto){
  //   return this.authService.signin(body);
  // }

//   @Post("/key")
//   generateProductKey(@Body() {userType, email}: GenerateProductKeyDto){
//     return this.authService.generateProductKey(email, userType)
//   }

  // @Get("/me")
  // me( @User() user: UserInfo ) {
  //   return user;
  // }
// }