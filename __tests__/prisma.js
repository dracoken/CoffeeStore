import createMockContext from "@/context";

let mockCtx;
let ctx;

beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx;
});

describe('prisma', () => {
    it('should be mocked', () => {
        expect(ctx.prisma).toBeDefined();
    });

    test('should return a user', async () => {
        const user = {
            id: 1,
            name: 'John Doe',
            email: 'jd@pitt.edu',
            worker: false
        };
        
        ctx.prisma.user.findUnique.mockResolvedValue(user);
        const result = await ctx.prisma.user.findUnique({ where: { id: 1 } });
        expect(result).toEqual(user);
    });

    test('it should create a user', async () => {
        const user = {
            id: 1,
            name: 'John Doe',
            email: 'jd@pitt.edu',
            worker: false
        };

        ctx.prisma.user.create.mockResolvedValue(user);
        const result = await ctx.prisma.user.create({ data: user });
        expect(result).toEqual(user);
    });
});