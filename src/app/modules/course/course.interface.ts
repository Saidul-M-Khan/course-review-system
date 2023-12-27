import { Model, Types } from 'mongoose';
// import { Types } from 'mongoose';

export type TTags = {
  name: string;
  isDeleted: boolean;
};

export type TDetails = {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
};

//! interface to retrieve course data
export type TCourse = {
  title: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags: TTags[];
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  durationInWeeks: number;
  details: TDetails;
  createdBy?: Types.ObjectId;
};

//! interface to retrieve paginated and filtered courses
export interface TResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: {
    courses: TCourse[]
  };
}

//! interface to detect if the course exists in the database
export interface CourseModel extends Model<TCourse> {
  // eslint-disable-next-line no-unused-vars
  isCourseExists(id: string): Promise<TCourse | null>;
}
