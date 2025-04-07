import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get the referrer to track which website is using the widget
  const url = new URL(request.url);
  const referrer = request.headers.get("Referer") || "unknown";
  const agencyId = url.searchParams.get("agencyId") || "default";
  const theme = url.searchParams.get("theme") || "default";

  // Generate the widget JavaScript code
  const widgetJs = `
    (function() {
      // Widget configuration
      const config = {
        agencyId: "${agencyId}",
        theme: "${theme}",
        baseUrl: "${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }",
      };
      
      // Create and inject styles
      const styles = document.createElement('style');
      styles.textContent = \`
        #seo-calculator-widget {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          line-height: 1.5;
          color: #333;
        }
        #seo-calculator-widget * {
          box-sizing: border-box;
        }
        #seo-calculator-widget .widget-container {
          max-width: 100%;
          margin: 0 auto;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        #seo-calculator-widget .widget-header {
          background-color: #f8f9fa;
          padding: 16px;
          text-align: center;
          border-bottom: 3px solid #2563eb;
        }
        #seo-calculator-widget .widget-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #1e3a8a;
        }
        #seo-calculator-widget .widget-header p {
          margin: 8px 0 0;
          color: #64748b;
        }
        #seo-calculator-widget .widget-content {
          background: white;
          padding: 20px;
        }
        #seo-calculator-widget .widget-footer {
          background-color: #f8f9fa;
          padding: 12px;
          text-align: center;
          font-size: 0.8rem;
          color: #64748b;
        }
        #seo-calculator-widget .form-group {
          margin-bottom: 16px;
        }
        #seo-calculator-widget label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
        }
        #seo-calculator-widget input, #seo-calculator-widget select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 1rem;
        }
        #seo-calculator-widget button {
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          width: 100%;
          font-weight: 500;
        }
        #seo-calculator-widget button:hover {
          background-color: #1d4ed8;
        }
        #seo-calculator-widget .progress-container {
          margin: 20px 0;
        }
        #seo-calculator-widget .progress-bar {
          height: 8px;
          background-color: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }
        #seo-calculator-widget .progress-bar-fill {
          height: 100%;
          background-color: #2563eb;
          transition: width 0.3s ease;
        }
        #seo-calculator-widget .step-indicator {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        #seo-calculator-widget .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
        }
        #seo-calculator-widget .spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #2563eb;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        #seo-calculator-widget .success-message {
          text-align: center;
          padding: 20px;
        }
        #seo-calculator-widget .success-icon {
          color: #10b981;
          font-size: 48px;
          margin-bottom: 16px;
        }
        #seo-calculator-widget .radio-group {
          display: flex;
          gap: 16px;
        }
        #seo-calculator-widget .radio-option {
          display: flex;
          align-items: center;
        }
        #seo-calculator-widget .radio-option input {
          width: auto;
          margin-right: 6px;
        }
        #seo-calculator-widget .switch-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        #seo-calculator-widget .switch-label {
          display: flex;
          flex-direction: column;
        }
        #seo-calculator-widget .switch-label-title {
          font-weight: 500;
          margin-bottom: 4px;
        }
        #seo-calculator-widget .switch-label-description {
          font-size: 0.875rem;
          color: #64748b;
        }
        #seo-calculator-widget .switch-toggle {
          display: flex;
          align-items: center;
        }
        #seo-calculator-widget .switch-text {
          font-size: 0.875rem;
          margin: 0 8px;
        }
        #seo-calculator-widget .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        #seo-calculator-widget .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        #seo-calculator-widget .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 24px;
        }
        #seo-calculator-widget .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        #seo-calculator-widget input:checked + .slider {
          background-color: #2563eb;
        }
        #seo-calculator-widget input:checked + .slider:before {
          transform: translateX(20px);
        }
        #seo-calculator-widget .badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          line-height: 1;
          border-radius: 9999px;
          margin-left: 0.5rem;
        }
        #seo-calculator-widget .badge-outline {
          border: 1px solid #d1d5db;
          color: #64748b;
        }
        #seo-calculator-widget .badge-primary {
          background-color: #2563eb;
          color: white;
        }
        #seo-calculator-widget .badge-secondary {
          background-color: #6b7280;
          color: white;
        }
        #seo-calculator-widget .icon {
          display: inline-block;
          width: 1em;
          height: 1em;
          margin-right: 0.25rem;
        }
        #seo-calculator-widget .tooltip {
          position: relative;
          display: inline-block;
          cursor: help;
        }
        #seo-calculator-widget .tooltip-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: #e2e8f0;
          color: #64748b;
          font-size: 12px;
          margin-left: 6px;
        }
        #seo-calculator-widget .tooltip-text {
          visibility: hidden;
          width: 200px;
          background-color: #333;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 8px;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.3s;
          font-size: 0.75rem;
          font-weight: normal;
        }
        #seo-calculator-widget .tooltip:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
        #seo-calculator-widget .competitor-item {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 12px;
        }
        #seo-calculator-widget .competitor-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        #seo-calculator-widget .competitor-name {
          font-weight: 500;
          margin: 0;
        }
        #seo-calculator-widget .competitor-url {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }
      \`;
      document.head.appendChild(styles);
      
      // Function to initialize the widget
      function initWidget() {
        // Find the container element
        const container = document.getElementById('seo-calculator-widget');
        if (!container) {
          console.error('SEO Calculator Widget: No container with ID "seo-calculator-widget" found');
          // Try again in a moment - the DOM might not be fully loaded
          setTimeout(initWidget, 300);
          return;
        }
        
        // Initialize widget state
        let currentStep = 1;
        let formData = {
          businessUrl: '',
          businessType: '',
          location: '',
          customerValue: '',
          competitorType: 'auto',
          analysisScope: 'local',
          competitors: ['', '', '', '', ''],
          email: ''
        };
        let processingProgress = 0;
        let reportId = '';
        
        // Render the initial widget
        renderWidget();
        
        // Main render function
        function renderWidget() {
          // Create widget structure
          container.innerHTML = \`
            <div class="widget-container">
              <div class="widget-header">
                <h2>SEO Opportunity Calculator</h2>
                <p>Discover your untapped SEO potential</p>
              </div>
              <div class="widget-content">
                <div class="progress-container">
                  <div class="step-indicator">
                    <span>Step \${currentStep} of 4</span>
                    <span>\${getStepName(currentStep)}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: \${getProgressWidth()}%"></div>
                  </div>
                </div>
                \${renderStepContent()}
              </div>
              <div class="widget-footer">
                Powered by SEO Opportunity Calculator
              </div>
            </div>
          \`;
          
          // Add event listeners after rendering
          addEventListeners();
        }
        
        // Get the current step name
        function getStepName(step) {
          switch(step) {
            case 1: return 'Business Information';
            case 2: return 'Competitors';
            case 3: return 'Processing';
            case 4: return 'Get Your Report';
            default: return '';
          }
        }
        
        // Get progress bar width based on current step
        function getProgressWidth() {
          switch(currentStep) {
            case 1: return 25;
            case 2: return 50;
            case 3: return 50 + processingProgress / 2;
            case 4: return 100;
            default: return 0;
          }
        }
        
        // Render content based on current step
        function renderStepContent() {
          switch(currentStep) {
            case 1: return renderBusinessInfoForm();
            case 2: return renderCompetitorForm();
            case 3: return renderProcessingScreen();
            case 4: return renderEmailForm();
            default: return '';
          }
        }
        
        // Step 1: Business Information Form
        function renderBusinessInfoForm() {
          return \`
            <form id="business-info-form">
              <div class="form-group">
                <label for="businessUrl">Your Website URL</label>
                <input 
                  type="url" 
                  id="businessUrl" 
                  placeholder="https://yourwebsite.com" 
                  value="\${formData.businessUrl}" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="businessType">Business Type</label>
                <input 
                  type="text" 
                  id="businessType" 
                  placeholder="e.g., Roofing, Home Improvement, Plumbing" 
                  value="\${formData.businessType}" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="location">Primary Location</label>
                <input 
                  type="text" 
                  id="location" 
                  placeholder="e.g., Chicago, IL" 
                  value="\${formData.location}" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="customerValue">Average Customer Value ($)</label>
                <input 
                  type="number" 
                  id="customerValue" 
                  placeholder="e.g., 5000" 
                  value="\${formData.customerValue}" 
                  required
                />
              </div>
              
              <div class="switch-container">
                <div class="switch-label">
                  <span class="switch-label-title">Analysis Scope</span>
                  <span class="switch-label-description">Choose between local or national competitor analysis</span>
                </div>
                <div class="switch-toggle">
                  <span class="switch-text" style="color: \${formData.analysisScope === 'local' ? '#2563eb' : '#64748b'}">Local</span>
                  <label class="switch">
                    <input 
                      type="checkbox" 
                      id="analysisScope" 
                      \${formData.analysisScope === 'national' ? 'checked' : ''}
                    />
                    <span class="slider"></span>
                  </label>
                  <span class="switch-text" style="color: \${formData.analysisScope === 'national' ? '#2563eb' : '#64748b'}">National</span>
                  <span class="tooltip">
                    <span class="tooltip-icon">?</span>
                    <span class="tooltip-text">
                      <strong>Local:</strong> Analyzes competitors in your specific location using Google Maps data.<br>
                      <strong>National:</strong> Analyzes top organic competitors nationwide using SearchAtlas data.
                    </span>
                  </span>
                </div>
              </div>
              
              <div class="form-group">
                <label>Competitor Selection</label>
                <div class="radio-group">
                  <div class="radio-option">
                    <input 
                      type="radio" 
                      id="competitorTypeAuto" 
                      name="competitorType" 
                      value="auto" 
                      \${formData.competitorType === 'auto' ? 'checked' : ''}
                    />
                    <label for="competitorTypeAuto">
                      Auto-detect competitors 
                      \${formData.analysisScope === 'local' ? 'from Google Maps' : 'from SearchAtlas'}
                    </label>
                  </div>
                  <div class="radio-option">
                    <input 
                      type="radio" 
                      id="competitorTypeManual" 
                      name="competitorType" 
                      value="manual" 
                      \${formData.competitorType === 'manual' ? 'checked' : ''}
                    />
                    <label for="competitorTypeManual">Manually enter competitors</label>
                  </div>
                </div>
              </div>
              
              <button type="submit">Continue</button>
            </form>
          \`;
        }
        
        // Step 2: Competitor Form
        function renderCompetitorForm() {
          let competitorFields = '';
          
          if (formData.competitorType === 'auto' && !formData.competitors[0]) {
            competitorFields = \`
              <div class="loading">
                <div class="spinner"></div>
                <p>
                  \${formData.analysisScope === 'local' 
                    ? \`Detecting local competitors in \${formData.location}...\` 
                    : 'Detecting national competitors in your industry...'}
                </p>
              </div>
            \`;
            
            // Simulate competitor detection
            setTimeout(() => {
              if (formData.analysisScope === 'local') {
                // Simulate local competitors from Google Maps
                formData.competitors = [
                  \`https://www.\${formData.location.toLowerCase().replace(/\\s+/g, '')}\${formData.businessType.toLowerCase().replace(/\\s+/g, '')}pros.com\`,
                  \`https://www.\${formData.businessType.toLowerCase().replace(/\\s+/g, '')}expertsof\${formData.location.toLowerCase().replace(/\\s+/g, '')}.com\`,
                  \`https://www.\${formData.location.toLowerCase().replace(/\\s+/g, '')}\${formData.businessType.toLowerCase().replace(/\\s+/g, '')}services.com\`,
                  \`https://www.best\${formData.businessType.toLowerCase().replace(/\\s+/g, '')}in\${formData.location.toLowerCase().replace(/\\s+/g, '')}.com\`,
                  \`https://www.\${formData.location.toLowerCase().replace(/\\s+/g, '')}premier\${formData.businessType.toLowerCase().replace(/\\s+/g, '')}.com\`
                ];
              } else {
                // Simulate national competitors from SearchAtlas
                formData.competitors = [
                  \`https://www.national\${formData.businessType.toLowerCase().replace(/\\s+/g, '')}.com\`,
                  \`https://www.\${formData.businessType.toLowerCase().replace(/\\s+/g, '')}america.com\`,
                  \`https://www.usa\${formData.businessType.toLowerCase().replace(/\\s+/g, '')}solutions.com\`,
                  \`https://www.\${formData.businessType.toLowerCase().replace(/\\s+/g, '')}nationwide.com\`,
                  \`https://www.premium\${formData.businessType.toLowerCase().replace(/\\s+/g, '')}services.com\`
                ];
              }
              renderWidget();
            }, 2000);
          } else {
            // Show detected competitors or input fields
            if (formData.competitorType === 'auto' && formData.competitors[0]) {
              competitorFields += \`
                <div style="margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h4 style="margin: 0; font-size: 0.875rem;">Detected Competitors</h4>
                    <span class="badge \${formData.analysisScope === 'local' ? 'badge-primary' : 'badge-secondary'}">
                      \${formData.analysisScope === 'local' 
                        ? '<span class="icon">📍</span> Local' 
                        : '<span class="icon">🌐</span> National'}
                    </span>
                  </div>
              \`;
              
              for (let i = 0; i < formData.competitors.length; i++) {
                if (formData.competitors[i]) {
                  const competitorName = formData.competitors[i].replace(/^https?:\\/\\/(?:www\\.)?/, '').split('.')[0];
                  competitorFields += \`
                    <div class="competitor-item">
                      <div class="competitor-header">
                        <div>
                          <p class="competitor-name">\${competitorName}</p>
                          <p class="competitor-url">\${formData.competitors[i]}</p>
                        </div>
                        <span class="badge badge-outline">
                          \${formData.analysisScope === 'local' ? 'Google Maps' : 'SearchAtlas'}
                        </span>
                      </div>
                    </div>
                  \`;
                }
              }
              
              competitorFields += '</div>';
            }
            
            for (let i = 0; i < 5; i++) {
              competitorFields += \`
                <div class="form-group">
                  <label for="competitor\${i}">Competitor \${i + 1} URL</label>
                  <input 
                    type="url" 
                    id="competitor\${i}" 
                    placeholder="https://competitor.com" 
                    value="\${formData.competitors[i] || ''}"
                  />
                </div>
              \`;
            }
          }
          
          return \`
            <form id="competitor-form">
              <div class="form-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <h3 style="margin: 0;">\${formData.competitorType === 'auto' ? 'Detected Competitors' : 'Enter Your Competitors'}</h3>
                  <span class="badge \${formData.analysisScope === 'local' ? 'badge-primary' : 'badge-secondary'}">
                    \${formData.analysisScope === 'local' 
                      ? '<span class="icon">📍</span> Local' 
                      : '<span class="icon">🌐</span> National'}
                  </span>
                </div>
                <p style="margin-top: 4px; font-size: 0.875rem; color: #64748b;">
                  \${formData.analysisScope === 'local' 
                    ? \`Based on your local market in \${formData.location}\`
                    : 'Based on national organic search rankings'}
                </p>
              </div>
              
              \${competitorFields}
              
              \${formData.competitorType === 'auto' && !formData.competitors[0] ? '' : \`
                <button type="submit">Continue</button>
              \`}
            </form>
          \`;
        }
        
        // Step 3: Processing Screen
        function renderProcessingScreen() {
          // Simulate progress updates
          if (processingProgress < 100) {
            setTimeout(() => {
              processingProgress += 5;
              renderWidget();
              
              if (processingProgress >= 100) {
                // Move to next step when processing is complete
                currentStep = 4;
                reportId = 'SAMPLE-REPORT-' + Date.now();
                renderWidget();
              }
            }, 300);
          }
          
          return \`
            <div class="loading">
              <div style="margin-bottom: 16px;">
                <span class="badge \${formData.analysisScope === 'local' ? 'badge-primary' : 'badge-secondary'}">
                  \${formData.analysisScope === 'local' 
                    ? '<span class="icon">📍</span> Local Analysis' 
                    : '<span class="icon">🌐</span> National Analysis'}
                </span>
              </div>
              <div class="spinner"></div>
              <p>\${getProcessingStatusMessage()}</p>
              <div class="progress-bar" style="width: 100%; margin-top: 20px;">
                <div class="progress-bar-fill" style="width: \${processingProgress}%"></div>
              </div>
              <p style="font-size: 0.9rem; color: #64748b; margin-top: 16px;">
                \${formData.analysisScope === 'local'
                  ? \`This may take a few minutes. We're analyzing your website and local competitors to identify SEO opportunities in your area.\`
                  : \`This may take a few minutes. We're analyzing your website and national competitors to identify SEO opportunities across the country.\`}
              </p>
            </div>
          \`;
        }
        
        // Get processing status message based on progress
        function getProcessingStatusMessage() {
          if (processingProgress < 25) {
            return "Analyzing your website...";
          } else if (processingProgress < 50) {
            return formData.analysisScope === 'local'
              ? "Gathering local competitor data..."
              : "Gathering national competitor data...";
          } else if (processingProgress < 75) {
            return "Collecting keyword rankings...";
          } else {
            return "Calculating revenue opportunities...";
          }
        }
        
        // Step 4: Email Form
        function renderEmailForm() {
          return \`
            <div class="success-message">
              <div class="success-icon">✓</div>
              <h3>Your SEO Report is Ready!</h3>
              <p>Enter your email below to receive your detailed SEO opportunity report.</p>
              <div style="margin: 16px 0;">
                <span class="badge \${formData.analysisScope === 'local' ? 'badge-primary' : 'badge-secondary'}">
                  \${formData.analysisScope === 'local' 
                    ? '<span class="icon">📍</span> Local Analysis' 
                    : '<span class="icon">🌐</span> National Analysis'}
                </span>
              </div>
            </div>
            
            <form id="email-form">
              <div class="form-group">
                <label for="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="your@email.com" 
                  value="\${formData.email}" 
                  required
                />
              </div>
              
              <button type="submit">Get My SEO Report</button>
              
              <p style="text-align: center; font-size: 0.8rem; color: #64748b; margin-top: 16px;">
                By submitting this form, you agree to receive your SEO report and occasional marketing emails.
              </p>
            </form>
          \`;
        }
        
        // Add event listeners to the current form
        function addEventListeners() {
          if (currentStep === 1) {
            const form = document.getElementById('business-info-form');
            if (form) {
              form.addEventListener('submit', handleBusinessInfoSubmit);
              
              // Add analysis scope toggle event listener
              const analysisScope = document.getElementById('analysisScope');
              if (analysisScope) {
                analysisScope.addEventListener('change', (e) => {
                  formData.analysisScope = e.target.checked ? 'national' : 'local';
                  // Update the competitor type label
                  const competitorTypeAutoLabel = document.querySelector('label[for="competitorTypeAuto"]');
                  if (competitorTypeAutoLabel) {
                    competitorTypeAutoLabel.innerHTML = \`Auto-detect competitors \${formData.analysisScope === 'local' ? 'from Google Maps' : 'from SearchAtlas'}\`;
                  }
                  // Update the toggle text colors
                  const localText = document.querySelector('.switch-toggle .switch-text:first-child');
                  const nationalText = document.querySelector('.switch-toggle .switch-text:last-of-type');
                  if (localText && nationalText) {
                    localText.style.color = formData.analysisScope === 'local' ? '#2563eb' : '#64748b';
                    nationalText.style.color = formData.analysisScope === 'national' ? '#2563eb' : '#64748b';
                  }
                });
              }
              
              // Add radio button event listeners
              const radioAuto = document.getElementById('competitorTypeAuto');
              const radioManual = document.getElementById('competitorTypeManual');
              if (radioAuto && radioManual) {
                radioAuto.addEventListener('change', () => {
                  formData.competitorType = 'auto';
                });
                radioManual.addEventListener('change', () => {
                  formData.competitorType = 'manual';
                });
              }
            }
          } else if (currentStep === 2) {
            const form = document.getElementById('competitor-form');
            if (form) {
              form.addEventListener('submit', handleCompetitorSubmit);
            }
          } else if (currentStep === 4) {
            const form = document.getElementById('email-form');
            if (form) {
              form.addEventListener('submit', handleEmailSubmit);
            }
          }
        }
        
        // Handle business info form submission
        function handleBusinessInfoSubmit(e) {
          e.preventDefault();
          
          // Update form data
          formData.businessUrl = document.getElementById('businessUrl').value;
          formData.businessType = document.getElementById('businessType').value;
          formData.location = document.getElementById('location').value;
          formData.customerValue = document.getElementById('customerValue').value;
          
          // Reset competitors array if switching analysis scope
          formData.competitors = ['', '', '', '', ''];
          
          // Move to next step
          currentStep = 2;
          renderWidget();
        }
        
        // Handle competitor form submission
        function handleCompetitorSubmit(e) {
          e.preventDefault();
          
          // Update form data if manual entry
          if (formData.competitorType === 'manual') {
            for (let i = 0; i < 5; i++) {
              const input = document.getElementById('competitor' + i);
              if (input) {
                formData.competitors[i] = input.value;
              }
            }
          }
          
          // Move to processing step
          currentStep = 3;
          processingProgress = 0;
          renderWidget();
          
          // In a real implementation, we would send the data to the server here
          // For now, we'll just simulate the processing
        }
        
        // Handle email form submission
        function handleEmailSubmit(e) {
          e.preventDefault();
          
          // Update form data
          formData.email = document.getElementById('email').value;
          
          // Send data to server
          fetch(\`\${config.baseUrl}/api/widget-submit\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              agencyId: config.agencyId,
              formData: formData,
              reportId: reportId,
              referrer: window.location.href
            })
          })
          .then(response => response.json())
          .then(data => {
            // Show thank you message
            container.innerHTML = \`
              <div class="widget-container">
                <div class="widget-header">
                  <h2>Thank You!</h2>
                </div>
                <div class="widget-content">
                  <div class="success-message">
                    <div class="success-icon">✓</div>
                    <h3>Your SEO Report Has Been Sent!</h3>
                    <p>Please check your email inbox for your detailed SEO opportunity report.</p>
                    <div style="margin: 16px 0;">
                      <span class="badge \${formData.analysisScope === 'local' ? 'badge-primary' : 'badge-secondary'}">
                        \${formData.analysisScope === 'local' 
                          ? '<span class="icon">📍</span> Local Analysis' 
                          : '<span class="icon">🌐</span> National Analysis'}
                      </span>
                    </div>
                    <p style="margin-top: 20px;">Want to discuss your SEO opportunities with an expert?</p>
                    <button onclick="window.open('\${config.baseUrl}/schedule-call?ref=widget&agency=\${config.agencyId}&scope=\${formData.analysisScope}', '_blank')">
                      Schedule a Free Consultation
                    </button>
                  </div>
                </div>
                <div class="widget-footer">
                  Powered by SEO Opportunity Calculator
                </div>
              </div>
            \`;
          })
          .catch(error => {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your request. Please try again.');
          });
        }
      }
      
      // Start the widget initialization
      // Use DOMContentLoaded or immediate execution depending on when the script is loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
      } else {
        initWidget();
      }
    })();
  `;

  // Return the JavaScript with proper content type
  return new NextResponse(widgetJs, {
    headers: {
      "Content-Type": "application/javascript",
    },
  });
}

// Track widget load in database (in a real implementation)
// await db.collection("widget_loads").insertOne({
//   agencyId,
//   referrer,
//   timestamp: new Date(),
//   theme
// });
