// Mock mongoose for frontend build
export default {
  connect: () => Promise.resolve(),
  model: () => ({}),
  Schema: class Schema {},
  Types: {
    ObjectId: class ObjectId {}
  }
};
