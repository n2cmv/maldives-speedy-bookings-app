
import { useState } from "react";
import { testBmlApiConnection, openBmlTestPage, BML_CONFIG } from "@/services/bmlPaymentService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import { ArrowLeft, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BmlApiTest = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  
  const checkApiConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testBmlApiConnection();
      setTestResult(result);
      
      if (result.success) {
        toast.success("BML API is operational", {
          description: "Successfully connected to the Bank of Maldives API"
        });
      } else {
        toast.error("BML API connection failed", {
          description: result.message || "Could not connect to Bank of Maldives API"
        });
      }
    } catch (error) {
      console.error("Error testing API:", error);
      toast.error("Error testing API connection", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
      setTestResult({ success: false, message: "Error during API test" });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Header />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            className="mb-8 flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">BML Payment Gateway API Test</h1>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">Check API Connection</h2>
                <p className="text-gray-600 mb-4">
                  Test the connection to the Bank of Maldives payment gateway API.
                </p>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <Button 
                    onClick={checkApiConnection}
                    disabled={isLoading}
                    className="bg-ocean hover:bg-ocean-dark"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Testing Connection...
                      </>
                    ) : "Test API Connection"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => openBmlTestPage()}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open BML Test Page
                  </Button>
                </div>
                
                {testResult && (
                  <div className={`mt-6 p-4 rounded-lg border ${testResult.success ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    <div className="flex items-start gap-3">
                      {testResult.success ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      )}
                      
                      <div>
                        <h3 className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                          {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                        </h3>
                        <p className={`${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                          {testResult.message}
                        </p>
                        
                        {testResult.details && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Response Details:</h4>
                            <pre className="bg-gray-100 p-3 rounded overflow-auto text-xs">
                              {JSON.stringify(testResult.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>
              
              <section className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Check Your Environment:</h3>
                    <p className="text-gray-600">
                      The application is currently using the BML <span className="font-semibold text-green-600">PRODUCTION</span> environment. 
                      The API base URL is: <code className="bg-gray-100 px-2 py-1 rounded">{BML_CONFIG.forceRealMode ? 
                        "https://api.merchants.bankofmaldives.com.mv" : 
                        "https://api.uat.merchants.bankofmaldives.com.mv"}</code>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Check Credentials:</h3>
                    <p className="text-gray-600">
                      Ensure your BML API credentials are correct and have the necessary permissions.
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-gray-600">
                      <li>Client ID: <code className="bg-gray-100 px-2 py-1 rounded">{BML_CONFIG.clientId.substring(0, 8)}...</code></li>
                      <li>API Key: <code className="bg-gray-100 px-2 py-1 rounded">{BML_CONFIG.apiKey.substring(0, 20)}...</code></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Network Issues:</h3>
                    <p className="text-gray-600">
                      Ensure there are no network restrictions blocking access to the BML API endpoints.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Check Browser Console:</h3>
                    <p className="text-gray-600">
                      Open your browser's developer tools (F12) and check the console for detailed logs about the BML API interactions.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BmlApiTest;
