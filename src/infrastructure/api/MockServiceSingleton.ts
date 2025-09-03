import { MockService } from "./mock.service";

export class MockServiceSingleton {
    private static instance: MockService;

    public static getInstance(): MockService {
        if (!MockServiceSingleton.instance) {
            MockServiceSingleton.instance = new MockService();
        }
        return MockServiceSingleton.instance;
    }
}
