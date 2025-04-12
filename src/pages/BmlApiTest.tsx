
import { useState } from "react";
import { testBmlApiConnection, BML_CONFIG } from "@/services/bmlPaymentService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import { ArrowLeft, CheckCircle, XCircle, ExternalLink, AlertTriangle, Server } from "lucide-react";
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
      setTestResult({ 
        success: false, 
        message: "Error during API test - CORS restrictions may be preventing direct access",
        isCorsError: error instanceof TypeError && error.message === "Failed to fetch"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to open BML test page in a new tab
  const openBmlTestPage = () => {
    window.open("https://api.merchants.bankofmaldives.com.mv/docs", "_blank");
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
                
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-amber-800">CORS Restrictions</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        Direct API testing from the browser may fail due to Cross-Origin Resource Sharing (CORS) 
                        restrictions. This is normal and expected for payment gateways, which typically require 
                        server-side requests.
                      </p>
                      <p className="text-sm text-amber-700 mt-2">
                        In production, your server will handle these API calls, avoiding CORS issues.
                      </p>
                    </div>
                  </div>
                </div>
                
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
                    onClick={openBmlTestPage}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open BML API Docs
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
                        
                        {testResult.isCorsError && (
                          <div className="mt-3 pt-3 border-t border-red-200">
                            <p className="text-red-700 font-medium">CORS Error Detected</p>
                            <p className="text-sm text-red-700 mt-1">
                              This is expected when testing directly from a browser. In production, 
                              your backend server will handle these API calls.
                            </p>
                          </div>
                        )}
                        
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
                      The API base URL is: <code className="bg-gray-100 px-2 py-1 rounded">https://api.merchants.bankofmaldives.com.mv</code>
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
                  
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Server className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-800">Server-Side Implementation</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          For optimal security and to avoid CORS issues, payment gateway API calls 
                          should be implemented server-side. Consider using Supabase Edge Functions 
                          to handle payment processing securely.
                        </p>
                      </div>
                    </div>
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
