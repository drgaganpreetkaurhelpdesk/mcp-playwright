import { VisibleTextTool, VisibleHtmlTool } from '../../../tools/browser/visiblePage.js';
import { ToolContext } from '../../../tools/common/types.js';
import { Page, Browser } from 'playwright';
import { jest } from '@jest/globals';

// Mock the Page object
const mockEvaluate = jest.fn();
const mockContent = jest.fn();
const mockIsClosed = jest.fn().mockReturnValue(false);

const mockPage = {
  evaluate: mockEvaluate,
  content: mockContent,
  isClosed: mockIsClosed
} as unknown as Page;

// Mock the browser
const mockIsConnected = jest.fn().mockReturnValue(true);
const mockBrowser = {
  isConnected: mockIsConnected
} as unknown as Browser;

// Mock the server
const mockServer = {
  sendMessage: jest.fn()
};

// Mock context
const mockContext = {
  page: mockPage,
  browser: mockBrowser,
  server: mockServer
} as ToolContext;

describe('VisibleTextTool', () => {
  let visibleTextTool: VisibleTextTool;

  beforeEach(() => {
    jest.clearAllMocks();
    visibleTextTool = new VisibleTextTool(mockServer);
    // Reset mocks
    mockIsConnected.mockReturnValue(true);
    mockIsClosed.mockReturnValue(false);
    mockEvaluate.mockImplementation(() => Promise.resolve('Sample visible text content'));
  });

  test('should retrieve visible text content', async () => {
    const args = {};

    const result = await visibleTextTool.execute(args, mockContext);

    expect(mockEvaluate).toHaveBeenCalled();
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('Visible text content');
    expect(result.content[0].text).toContain('Sample visible text content');
  });

  test('should handle missing page', async () => {
    const args = {};

    // Context with browser but without page
    const contextWithoutPage = {
      browser: mockBrowser,
      server: mockServer
    } as unknown as ToolContext;

    const result = await visibleTextTool.execute(args, contextWithoutPage);

    expect(mockEvaluate).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Page is not available');
  });
  
  test('should handle disconnected browser', async () => {
    const args = {};
    
    // Mock disconnected browser
    mockIsConnected.mockReturnValueOnce(false);
    
    const result = await visibleTextTool.execute(args, mockContext);
    
    expect(mockEvaluate).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Browser is not connected');
  });
  
  test('should handle closed page', async () => {
    const args = {};
    
    // Mock closed page
    mockIsClosed.mockReturnValueOnce(true);
    
    const result = await visibleTextTool.execute(args, mockContext);
    
    expect(mockEvaluate).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Page is not available or has been closed');
  });

  test('should handle evaluation errors', async () => {
    const args = {};

    // Mock evaluation error
    mockEvaluate.mockImplementationOnce(() => Promise.reject(new Error('Evaluation failed')));

    const result = await visibleTextTool.execute(args, mockContext);

    expect(mockEvaluate).toHaveBeenCalled();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Failed to get visible text content');
    expect(result.content[0].text).toContain('Evaluation failed');
  });
});

describe('VisibleHtmlTool', () => {
  let visibleHtmlTool: VisibleHtmlTool;

  beforeEach(() => {
    jest.clearAllMocks();
    visibleHtmlTool = new VisibleHtmlTool(mockServer);
    // Reset mocks
    mockIsConnected.mockReturnValue(true);
    mockIsClosed.mockReturnValue(false);
    mockContent.mockImplementation(() => Promise.resolve('<html><body>Sample HTML content</body></html>'));
  });

  test('should retrieve HTML content', async () => {
    const args = {};

    const result = await visibleHtmlTool.execute(args, mockContext);

    expect(mockContent).toHaveBeenCalled();
    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain('HTML content');
    expect(result.content[0].text).toContain('<html><body>Sample HTML content</body></html>');
  });

  test('should handle missing page', async () => {
    const args = {};

    // Context with browser but without page
    const contextWithoutPage = {
      browser: mockBrowser,
      server: mockServer
    } as unknown as ToolContext;

    const result = await visibleHtmlTool.execute(args, contextWithoutPage);

    expect(mockContent).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Page is not available');
  });
  
  test('should handle disconnected browser', async () => {
    const args = {};
    
    // Mock disconnected browser
    mockIsConnected.mockReturnValueOnce(false);
    
    const result = await visibleHtmlTool.execute(args, mockContext);
    
    expect(mockContent).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Browser is not connected');
  });
  
  test('should handle closed page', async () => {
    const args = {};
    
    // Mock closed page
    mockIsClosed.mockReturnValueOnce(true);
    
    const result = await visibleHtmlTool.execute(args, mockContext);
    
    expect(mockContent).not.toHaveBeenCalled();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Page is not available or has been closed');
  });

  test('should handle content retrieval errors', async () => {
    const args = {};

    // Mock content error
    mockContent.mockImplementationOnce(() => Promise.reject(new Error('Content retrieval failed')));

    const result = await visibleHtmlTool.execute(args, mockContext);

    expect(mockContent).toHaveBeenCalled();
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Failed to get visible HTML content');
    expect(result.content[0].text).toContain('Content retrieval failed');
  });
});