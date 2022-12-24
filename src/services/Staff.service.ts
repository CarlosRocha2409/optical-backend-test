import { StaffDTO } from "../dtos/staff.dto";
import { ApiError } from "../error-handling/ApiError";
import { Staff } from "../repository/Staff.repository";
import { BAD_REQUEST, INTERNAL_SERVER } from "../types/error.type";
import {
  IStaffInput,
  IstaffLogin,
  IStaffUpdate,
  StaffInputKeys,
  StaffUpdateKeys,
} from "../types/staff.type";
import {
  comparePasswords,
  generateJWT,
  generatePasswordHash,
} from "../utils/auth.utils";
import { throwServerError, validateFields } from "../utils/validation.util";

export class StaffService {
  repo: typeof Staff;

  constructor() {
    this.repo = Staff;
  }
  async findById(id: string) {
    return this.repo
      .findById(id)
      .then((user) => {
        if (!user)
          throw new ApiError(`User with id ${id} not found`, BAD_REQUEST);

        return new StaffDTO(user);
      })
      .catch((e) => {
        if (e.statusCode) throw e;
        throw new ApiError(`User with id ${id} not found`, BAD_REQUEST);
      });
  }

  private async validateCreation(user: IStaffInput) {
    validateFields({
      fields: StaffInputKeys,
      item: user,
      action: "creating a",
      itemName: "staff member",
    });
    const exist = await this.repo.findOne({ email: user.email });
    if (exist)
      throw new ApiError(`Email ${user.email} is already taken`, BAD_REQUEST);
  }

  async login(user: IstaffLogin) {
    return this.repo.findOne({ email: user.email }).then(async (u) => {
      if (!u) throw new ApiError(`Wrong Credentials`, BAD_REQUEST);

      const correctPassword = await comparePasswords(
        user.password,
        u.passwordHash
      );

      if (!correctPassword)
        throw new ApiError(`Wrong Credentials`, BAD_REQUEST);
      return {
        jwt: await generateJWT({ id: u.id, ...user }),
      };
    });
  }

  async create(user: IStaffInput) {
    await this.validateCreation(user);

    const errorCreatingUser = (e: any) => {
      throw throwServerError(e, "creating a user");
    };

    const passwordHash = await generatePasswordHash(user.password).catch(
      (e) => {
        throw errorCreatingUser(e);
      }
    );

    return this.repo
      .create({
        ...user,
        passwordHash,
      })
      .then((u) => ({ id: u.id }))
      .catch(errorCreatingUser);
  }

  private async validateUpdate(user: IStaffUpdate) {
    validateFields({
      fields: StaffUpdateKeys,
      item: user,
      action: "updating a",
      itemName: "staff member",
    });

    await this.findById(user.id);

    if (user.email) {
      const existEmail = await this.repo.findOne({ email: user.email });
      if (existEmail && existEmail._id.toString() !== user.id) {
        throw new ApiError(`Email ${user.email} is already taken`, BAD_REQUEST);
      }
    }
  }

  async update(user: IStaffUpdate) {
    await this.validateUpdate(user);

    let update = user;

    if (user.password) {
      const { password, ...fields } = user;
      update = fields;
    }

    const errorUpdatingUser = (e: any) => {
      throw throwServerError(e, "updating a user");
    };

    return this.repo
      .updateOne(
        { id: user.id },
        {
          ...update,
        }
      )
      .then(() => {
        return {
          id: user.id,
        };
      })
      .catch((e) => {
        throw errorUpdatingUser(e);
      });
  }
}
