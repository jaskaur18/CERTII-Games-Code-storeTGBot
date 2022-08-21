import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: 0,
  },
})
// eslint-disable-next-line import/prefer-default-export
export class Categories {
  @prop({ required: true, index: true, unique: true })
  id!: string

  @prop({ required: true })
  name!: string
}

const CategoriesModel = getModelForClass(Categories)

//get all categories
export async function getCategories(): Promise<Categories[]> {
  return await CategoriesModel.find()
}

//get category by id
export async function getCategoryById(id: string): Promise<Categories | null> {
  return await CategoriesModel.findOne({ id })
}

export function findOrCreateCategories(id: string, name?: string) {
  return CategoriesModel.findOneAndUpdate(
    { id },
    { name },
    {
      upsert: true,
      new: true,
    }
  )
}

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: 0,
  },
})
// eslint-disable-next-line import/prefer-default-export
export class SubCategories {
  @prop({ required: true, index: true, unique: true })
  id!: string

  @prop({ required: true })
  parentCategoryId!: string

  @prop({ required: true })
  name!: string
}

const SubCategoriesModel = getModelForClass(SubCategories)

export function findOrCreateSubCategories(
  id: string,
  parentCategoryId?: string,
  name?: string
) {
  return SubCategoriesModel.findOneAndUpdate(
    { id },
    { parentCategoryId, name },
    {
      upsert: true,
      new: true,
    }
  )
}

//get sub category by id
export async function getSubCategoryById(
  id: string
): Promise<SubCategories | null> {
  return await SubCategoriesModel.findOne({ id })
}

//get subcategories by parent category id
export function getSubCategories(parentCategoryId: string) {
  return SubCategoriesModel.find({ parentCategoryId })
}
