declare namespace API {
  type Dictionary = {
    code?: string;
    item_values?: string;
    name?: string;
    id?: number;
  };

  type getByCodeParams = {
    code: string;
  };
}
