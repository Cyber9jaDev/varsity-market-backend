import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UnauthorizedException, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ProductResponseDto, UpdateProductDto } from './dtos/product.dto';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/interface/user.interface';
import { CategoryType, ConditionType, Location, UserType } from '@prisma/client';
import { Roles } from 'src/decorator/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { OrderByEnum } from './interface/product.interface';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { isValidDate } from 'src/helpers/functions';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Get all products
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ example: '', required: false, name: 'searchText', type: 'string' })
  @ApiQuery({ required: false, name: 'category', enum: CategoryType })
  @ApiQuery({ required: false, name: 'orderBy', enum: OrderByEnum })
  @ApiQuery({ required: false, name: 'location', enum: Location })
  @ApiQuery({
    // example: 10000,
    required: false,
    name: 'minPrice',
    type: 'number',
    minimum: 1,
    maximum: 10000000,
  })
  @ApiQuery({
    // example: 500000,
    required: false,
    name: 'maxPrice',
    type: 'number',
  })
  @ApiQuery({
    example: '2010-08-12T16:16:32.282Z',
    required: false,
    name: 'dateFrom',
    type: String,
  })
  @ApiQuery({
    example: '2024-12-12T16:16:32.282Z',
    required: false,
    name: 'dateTo',
    type: String,
  })
  @ApiQuery({ example: 1, required: false, name: 'page', type: 'page number' })
  @ApiQuery({
    example: 5,
    required: false,
    name: 'limit',
    type: 'number',
    description: 'Number of products to be returned per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
    // type: [ProductResponseDto],
    schema: {
      example: {
        products: {
          id: '58b7f14f-dcdd-4957-867e-0cf7f88b00fb',
          name: 'Range Rover',
          description: 'Range Rover',
          price: 150000,
          condition: 'NEW',
          location: 'OAU',
          createdAt: '2024-08-09T20:22:56.624Z',
          seller: {
            name: 'Seller 1',
            phone: '8012228021',
            email: 'seller1@gmail.com',
          },
          images: [
            {
              secure_url:
                'https://res.cloudinary.com/unimarket/image/upload/v1723234978/unimarket/posts/qwb17b2au7ghhaly9t3n.jpg',
            },
          ],
        },
        totalPages: 1,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
  async getAllProducts(
    @Query('searchText') searchText?: string,
    @Query('category') category?: CategoryType,
    @Query('location') location?: Location,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('orderBy') orderBy?: OrderByEnum,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ): Promise<{ products: ProductResponseDto[]; totalPages: number }> {
    const categories = Object.values(CategoryType);
    const locations = Object.values(Location);

    if (
      (dateFrom && !isValidDate(dateFrom)) ||
      (dateTo && !isValidDate(dateTo))
    ) {
      throw new BadRequestException('Invalid date format');
    }

    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: minPrice }),
            ...(maxPrice && { lte: maxPrice }),
          }
        : undefined;

    const createdAt =
      dateFrom || dateTo
        ? {
            ...(dateFrom && { gte: new Date(dateFrom) }),
            ...(dateTo && { lte: new Date(dateTo) }),
          }
        : undefined;

    // Create a dynamic filter object, consisting of the queries passed
    const filter = {
      ...(searchText && {
        name: {
          search: searchText.split(' ').join(' & '),
          mode: 'insensitive',
        },
      }),
      ...(categories.includes(category) && { category }),
      ...(price && { price }),
      ...(locations.includes(location) && { location }),
      ...(createdAt && { createdAt }),
    };

    const orderProductsBy = { ...(orderBy && { price: orderBy }) };

    const take = limit ? Math.max(1, limit) : 10; // Ensure a positive limit or default to 10 items per page
    const page_ = Math.max(1, page) || 1; // Ensure a positive page number or default to page 1
    const skip = (page_ - 1) * take;

    const { products, countProducts } =
      await this.productService.getAllProducts(
        filter,
        orderProductsBy,
        take,
        skip,
      );

    return {
      products,
      totalPages: Math.ceil(countProducts / take), // Number of pages for pagination on the frontend
    };
  }

  // Get all products belonging to a user
  @Get("/user-ads/:userId")
  @Roles(UserType.SELLER)
  @ApiParam({ name: 'userId', type: 'string', required: true, example: '58b7f14f-dcdd-4957-867e-0cf7f88b00fb' })
  async getAllUserProducts(
    @User() user: UserEntity,
    @Param("userId") userId: string
  ): Promise<ProductResponseDto[]>{

    if (user.userId !== userId){
      throw new UnauthorizedException("Unauthorized")
    }

    return this.productService.getAllUserProducts(userId);
  }

  // Find a single product
  @Get('/:productId')
  @ApiParam({ name: 'productId', type: 'string', required: true, example: '58b7f14f-dcdd-4957-867e-0cf7f88b00fb'})
  @ApiResponse({
    status: 200,
    description: 'Ok',
    schema: {
      example: {
        id: '58b7f14f-dcdd-4957-867e-0cf7f88b00fb',
        name: 'Range Rover',
        description: 'Range Rover',
        price: 150000,
        condition: 'NEW',
        location: 'OAU',
        seller: {
          name: 'Seller 1',
          phone: '8012228021',
          email: 'seller1@gmail.com',
        },
        images: [
          {
            secure_url:
              'https://res.cloudinary.com/unimarket/image/upload/v1723234978/unimarket/posts/qwb17b2au7ghhaly9t3n.jpg',
          },
        ],
        createdAt: '2024-08-09T20:22:56.624Z',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Not Found',
        error: 'Not Found',
      },
    },
  })
  @ApiOperation({ summary: 'Get a single product by id' })
  getSingleProduct( @Param('productId') productId: string ): Promise<ProductResponseDto> {
    return this.productService.getSingleProduct(productId);
  }

  // Add a new product
  @Post('/add-product')
  @Roles(UserType.SELLER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add new product',
    description: 'Only a verified SELLER can add new product',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('productImages'))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      required: [
        'name',
        'description',
        'price',
        'location',
        'category',
        'condition',
        'productImages',
        "quantity"
      ],
      properties: {
        name: { type: 'string', example: 'Samsung Galaxy 12 Notebook' },
        description: { type: 'string', example: 'Samsung Galaxy 12 Notebook' },
        price: { type: 'number' },
        quantity: { type: 'number', default: 1 },
        location: {
          type: 'string',
          enum: Object.values(Location),
          example: Location.OAU,
        },
        condition: {
          type: 'string',
          enum: Object.values(ConditionType),
          example: ConditionType.NEW,
        },
        category: {
          type: 'string',
          enum: Object.values(CategoryType),
          example: CategoryType.COMPUTER,
        },
        productImages: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
    schema: {
      example: {
        id: '2fa0d359-497d-45cb-9e53-431170ca18ed',
        name: 'Yamaha 50CC Bike',
        description: 'Yamaha 50CC Bike',
        price: 20000,
        category: 'BIKE',
        condition: 'USED',
        location: 'UI',
        seller: {
          name: 'Seller 1',
          phone: '8012228021',
          email: 'seller1@gmail.com',
        },
        images: [
          {
            secure_url:
              'https://res.cloudinary.com/unimarket/image/upload/v1730728428/unimarket/posts/mfktzcxhefc7otlgxthj.jpg',
          },
        ],
        createdAt: '2024-11-04T11:50:59.775Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        message: 'An error',
        error: 'bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: {
      example: {
        message: 'You are not allowed to add new product',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'An error has occurred, please try again',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  async addProduct(
    @Body() createProductDto: CreateProductDto,
    @User() user: UserEntity,
    @UploadedFiles() productImages: Express.Multer.File[],
  ): Promise<ProductResponseDto> {
    if (!productImages || productImages.length === 0) {
      throw new UnauthorizedException('Please upload at least one image');
    }

    // Upload images to cloudinary
    const uploadPromises = productImages.map(
      async (image) =>
        await this.cloudinaryService.uploadImage(image, 'unimarket/posts'),
    );

    const uploadedImages = await Promise.all(uploadPromises);

    if (!uploadedImages)
      throw new BadRequestException('Error uploading images');

    const images = uploadedImages.map((image) => {
      return {
        secure_url: image.secure_url,
        public_id: image.public_id,
        asset_id: image.asset_id,
      };
    });

    return this.productService.addProduct(
      user?.userId,
      images,
      createProductDto,
    );
  }

  // Update a single product
  @Put('/:productId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a product',
    description: 'Only a seller can update a product',
  })
  @ApiParam({ name: 'productId', required: true })
  @ApiResponse({ status: 200, description: 'Ok', type: UpdateProductDto })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'An error has occurred, please try again',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        message: 'Bad Request',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: {
      example: {
        message: 'You are not allowed to update this product',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Mot Found',
    schema: {
      example: {
        message: 'No product found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Roles(UserType.SELLER)
  async updateProduct(
    @Param('productId') productId: string,
    @User() user: UserEntity,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.findUserByProductId(productId);

    if (product.sellerId !== user.userId) {
      throw new UnauthorizedException(
        'You are not allowed to update this product.',
      );
    }

    return this.productService.updateProduct(productId, updateProductDto);
  }


  // Delete a Product
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Only a seller can delete a product',
  })
  @ApiParam({ name: 'productId', required: true })
  @ApiResponse({
    status: 200,
    description: 'Ok',
    schema: {
      example: {
        message: 'Product deleted successfully',
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'An error has occurred, please try again',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        message: 'Bad Request',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: {
      example: {
        message: 'You are not allowed to delete this product',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Mot Found',
    schema: {
      example: {
        message: 'No product found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Delete('/delete/:productId')
  @Roles(UserType.SELLER)
  async deleteProduct(
    @Param('productId') productId: string,
    @User() user: UserEntity,
  ) {
    const product = await this.productService.findUserByProductId(productId);

    if (product.sellerId !== user.userId) {
      throw new UnauthorizedException(
        'You are not allowed to update this product.',
      );
    }

    return this.productService.deleteProduct(productId);
  }
}
