<template>
  <VContainer fluid class="py-8">
    <h1 class="text-h2 color-primary mb-6">
      Admin Guide - The Paws
    </h1>

    <div class="mb-8">
      <p class="text-h6 font-weight-regular">
        Welcome to the Administrator Guide for The Paws. This comprehensive guide will help you 
        manage adoption requests, handle pet inventory, and maintain smooth shelter operations.
      </p>
    </div>

    <!-- Table of Contents -->
    <VCard class="mb-8" variant="outlined">
      <VCardTitle class="text-h5">
        Table of Contents
      </VCardTitle>
      <VCardText>
        <VList density="compact">
          <VListItem @click="scrollTo('admin-overview')">
            <VListItemTitle>1. Admin Panel Overview</VListItemTitle>
          </VListItem>
          <VListItem @click="scrollTo('dashboard')">
            <VListItemTitle>2. Dashboard</VListItemTitle>
          </VListItem>
          <VListItem @click="scrollTo('managing-requests')">
            <VListItemTitle>3. Managing Requests</VListItemTitle>
          </VListItem>
          <VListItem @click="scrollTo('request-lifecycle')">
            <VListItemTitle>4. Request Lifecycle Management</VListItemTitle>
          </VListItem>
          <VListItem @click="scrollTo('pet-inventory')">
            <VListItemTitle>5. Pet Inventory Management</VListItemTitle>
          </VListItem>
          <VListItem @click="scrollTo('best-practices')">
            <VListItemTitle>6. Best Practices</VListItemTitle>
          </VListItem>
          <VListItem @click="scrollTo('troubleshooting')">
            <VListItemTitle>7. Troubleshooting</VListItemTitle>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>

    <!-- Admin Overview -->
    <section id="admin-overview" class="mb-8">
      <h2 class="text-h4 mb-4">
        1. Admin Panel Overview
      </h2>
      <VCard variant="outlined">
        <VCardText>
          <p class="mb-4">
            The Admin Panel is your central hub for managing all shelter operations. As an administrator, 
            you have access to three main sections:
          </p>
          
          <VRow>
            <VCol cols="12" md="4">
              <VCard color="blue-lighten-5" height="100%">
                <VCardTitle class="text-h6">
                  <VIcon color="blue" class="mr-2">
                    mdi-view-dashboard
                  </VIcon>
                  Dashboard
                </VCardTitle>
                <VCardText>
                  Overview of all requests and pets with key statistics and insights.
                </VCardText>
              </VCard>
            </VCol>
            
            <VCol cols="12" md="4">
              <VCard color="green-lighten-5" height="100%">
                <VCardTitle class="text-h6">
                  <VIcon color="green" class="mr-2">
                    mdi-file-document-multiple
                  </VIcon>
                  Requests
                </VCardTitle>
                <VCardText>
                  Manage all visit and adoption requests from users, including approval, rejection, 
                  and fulfillment tracking.
                </VCardText>
              </VCard>
            </VCol>
            
            <VCol cols="12" md="4">
              <VCard color="purple-lighten-5" height="100%">
                <VCardTitle class="text-h6">
                  <VIcon color="purple" class="mr-2">
                    mdi-paw
                  </VIcon>
                  Pet Inventory
                </VCardTitle>
                <VCardText>
                  Add, edit, remove, and renew pets in the system. Maintain accurate pet information 
                  and availability.
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

          <VAlert type="info" variant="tonal" class="mt-6">
            <strong>Admin Access:</strong> Only users with admin privileges can access this panel. 
            Admin status is managed through Firebase custom claims.
          </VAlert>
        </VCardText>
      </VCard>
    </section>

    <!-- Dashboard -->
    <section id="dashboard" class="mb-8">
      <h2 class="text-h4 mb-4">
        2. Dashboard
      </h2>
      <VCard variant="outlined">
        <VCardText>
          <p class="mb-4">
            The Dashboard provides a quick overview of shelter operations with key metrics and statistics.
          </p>
          
          <p class="mb-4">
            <strong>Key Metrics Displayed:</strong>
          </p>
          <ul class="ml-6 mb-4">
            <li>
              <strong>Total Requests:</strong> All visit and adoption requests across all statuses
            </li>
            <li>
              <strong>Pending Requests:</strong> Requests awaiting your review
            </li>
            <li>
              <strong>Approved Requests:</strong> Requests you've approved that are in progress
            </li>
            <li>
              <strong>Total Pets:</strong> Number of pets currently in the system
            </li>
          </ul>

          <p class="mb-4">
            <strong>Request Breakdown by Type:</strong>
          </p>
          <ul class="ml-6 mb-4">
            <li>
              Separate statistics for visit requests and adoption requests
            </li>
            <li>
              Visual indicators for pending items requiring attention
            </li>
          </ul>

          <VAlert type="success" variant="tonal" class="mt-4">
            <strong>Tip:</strong> Check the Dashboard regularly to stay on top of pending requests 
            and ensure timely responses to users.
          </VAlert>
        </VCardText>
      </VCard>
    </section>

    <!-- Managing Requests -->
    <section id="managing-requests" class="mb-8">
      <h2 class="text-h4 mb-4">
        3. Managing Requests
      </h2>
      <VCard variant="outlined">
        <VCardText>
          <p class="mb-4">
            The Requests tab is where you'll spend most of your time, reviewing and managing user 
            requests for visits and adoptions.
          </p>
          
          <h3 class="text-h6 mb-3">
            Request Organization
          </h3>
          <p class="mb-4">
            Requests are organized into four main tables:
          </p>
          
          <VRow class="mb-4">
            <VCol cols="12" md="6">
              <VCard variant="outlined">
                <VCardTitle class="text-subtitle-1">
                  Visit Requests
                </VCardTitle>
                <VCardText>
                  <ul class="ml-4">
                    <li>
                      <strong>Active Table:</strong> Pending and approved visit requests
                    </li>
                    <li>
                      <strong>Archive Table:</strong> Fulfilled, unfulfilled, and rejected visits
                    </li>
                  </ul>
                </VCardText>
              </VCard>
            </VCol>
            
            <VCol cols="12" md="6">
              <VCard variant="outlined">
                <VCardTitle class="text-subtitle-1">
                  Adoption Requests
                </VCardTitle>
                <VCardText>
                  <ul class="ml-4">
                    <li>
                      <strong>Active Table:</strong> Pending and approved adoption requests
                    </li>
                    <li>
                      <strong>Archive Table:</strong> Fulfilled, unfulfilled, and rejected adoptions
                    </li>
                  </ul>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

          <h3 class="text-h6 mb-3">
            Request Information
          </h3>
          <p class="mb-2">
            Each request displays the following information:
          </p>
          <ul class="ml-6 mb-4">
            <li>
              <strong>Pet Name:</strong> The pet associated with the request
            </li>
            <li>
              <strong>User Name:</strong> The person making the request
            </li>
            <li>
              <strong>User Email:</strong> Contact information for follow-up
            </li>
            <li>
              <strong>Request Type:</strong> Visit or Adoption
            </li>
            <li>
              <strong>Date/Time:</strong> For visit requests, the scheduled date and time
            </li>
            <li>
              <strong>Status:</strong> Current state of the request
            </li>
            <li>
              <strong>Created At:</strong> When the request was submitted
            </li>
            <li>
              <strong>Responded At:</strong> When you took action (if applicable)
            </li>
            <li>
              <strong>Comments:</strong> Any notes or rejection reasons
            </li>
          </ul>

          <h3 class="text-h6 mb-3">
            Available Actions
          </h3>
          <p class="mb-4">
            The actions available depend on the current status of the request:
          </p>

          <VExpansionPanels variant="accordion" class="mb-4">
            <VExpansionPanel>
              <VExpansionPanelTitle>
                <VIcon color="orange" class="mr-2">
                  mdi-clock-outline
                </VIcon>
                Pending Requests
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <p class="mb-2">
                  <strong>Available Actions:</strong>
                </p>
                <ul class="ml-6 mb-3">
                  <li>
                    <strong>Approve:</strong> Accept the request - allows the user to proceed with 
                    the visit or adoption process
                  </li>
                  <li>
                    <strong>Reject:</strong> Decline the request - opens a dialog to provide a 
                    reason for rejection
                  </li>
                </ul>
                <p class="mb-2">
                  <strong>How to Approve:</strong>
                </p>
                <ol class="ml-6 mb-3">
                  <li>
                    Review the request details
                  </li>
                  <li>
                    Click the green "Approve" button
                  </li>
                  <li>
                    The status changes to "Approved" and the user is notified
                  </li>
                </ol>
                <p class="mb-2">
                  <strong>How to Reject:</strong>
                </p>
                <ol class="ml-6">
                  <li>
                    Click the red "Reject" button
                  </li>
                  <li>
                    In the dialog, enter a clear reason for rejection
                  </li>
                  <li>
                    Click "Reject" to confirm
                  </li>
                  <li>
                    The request moves to rejected status with your comment visible to the user
                  </li>
                </ol>
              </VExpansionPanelText>
            </VExpansionPanel>

            <VExpansionPanel>
              <VExpansionPanelTitle>
                <VIcon color="green" class="mr-2">
                  mdi-check-circle
                </VIcon>
                Approved Requests
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <p class="mb-2">
                  <strong>Available Actions:</strong>
                </p>
                <ul class="ml-6 mb-3">
                  <li>
                    <strong>Mark Fulfilled:</strong> Confirms that the visit happened or adoption 
                    was completed successfully
                  </li>
                  <li>
                    <strong>Mark Unfulfilled:</strong> Indicates that the visit didn't happen or 
                    adoption fell through
                  </li>
                </ul>
                <p class="mb-2">
                  <strong>When to Mark Fulfilled:</strong>
                </p>
                <ul class="ml-6 mb-3">
                  <li>
                    The user visited the shelter at the scheduled time (for visits)
                  </li>
                  <li>
                    The adoption paperwork is complete and the pet has been transferred (for adoptions)
                  </li>
                </ul>
                <p class="mb-2">
                  <strong>When to Mark Unfulfilled:</strong>
                </p>
                <ul class="ml-6">
                  <li>
                    The user didn't show up for the scheduled visit
                  </li>
                  <li>
                    The adoption was cancelled or didn't proceed
                  </li>
                  <li>
                    Any other circumstance that prevented completion
                  </li>
                </ul>
              </VExpansionPanelText>
            </VExpansionPanel>

            <VExpansionPanel>
              <VExpansionPanelTitle>
                <VIcon color="red" class="mr-2">
                  mdi-close-circle
                </VIcon>
                Rejected Requests
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <p class="mb-2">
                  <strong>Available Action:</strong>
                </p>
                <ul class="ml-6 mb-3">
                  <li>
                    <strong>Mark Unfulfilled:</strong> Moves the request to the archive
                  </li>
                </ul>
                <p>
                  Rejected requests should be marked as unfulfilled to clear them from the active 
                  list and maintain a clean archive.
                </p>
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>

          <VAlert type="warning" variant="tonal">
            <strong>Important:</strong> Always provide a clear, polite reason when rejecting requests. 
            Users can see these comments and may submit new requests based on your feedback.
          </VAlert>
        </VCardText>
      </VCard>
    </section>

    <!-- Request Lifecycle -->
    <section id="request-lifecycle" class="mb-8">
      <h2 class="text-h4 mb-4">
        4. Request Lifecycle Management
      </h2>
      <VCard variant="outlined">
        <VCardText>
          <p class="mb-4">
            Understanding the request lifecycle helps you manage requests effectively and maintain 
            accurate records.
          </p>

          <h3 class="text-h6 mb-3">
            Request Status Flow
          </h3>
          
          <VCard color="grey-lighten-4" class="mb-4 pa-4">
            <div class="d-flex align-center justify-space-between flex-wrap">
              <VChip color="orange" class="ma-1">
                Pending
              </VChip>
              <VIcon>mdi-arrow-right</VIcon>
              <VChip color="green" class="ma-1">
                Approved
              </VChip>
              <VIcon>mdi-arrow-right</VIcon>
              <VChip color="blue" class="ma-1">
                Fulfilled
              </VChip>
            </div>
            <VDivider class="my-3" />
            <div class="d-flex align-center justify-space-between flex-wrap">
              <VChip color="orange" class="ma-1">
                Pending
              </VChip>
              <VIcon>mdi-arrow-right</VIcon>
              <VChip color="red" class="ma-1">
                Rejected
              </VChip>
              <VIcon>mdi-arrow-right</VIcon>
              <VChip color="grey" class="ma-1">
                Unfulfilled
              </VChip>
            </div>
            <VDivider class="my-3" />
            <div class="d-flex align-center justify-space-between flex-wrap">
              <VChip color="green" class="ma-1">
                Approved
              </VChip>
              <VIcon>mdi-arrow-right</VIcon>
              <VChip color="grey" class="ma-1">
                Unfulfilled
              </VChip>
            </div>
          </VCard>

          <h3 class="text-h6 mb-3">
            Detailed Status Descriptions
          </h3>
          
          <VExpansionPanels variant="accordion">
            <VExpansionPanel>
              <VExpansionPanelTitle>Pending</VExpansionPanelTitle>
              <VExpansionPanelText>
                <p class="mb-2">
                  <strong>Definition:</strong> User submitted a request awaiting admin review
                </p>
                <p class="mb-2">
                  <strong>Your Responsibility:</strong> Review within 24 hours
                </p>
                <p class="mb-2">
                  <strong>Next Steps:</strong> Approve or Reject
                </p>
                <p>
                  <strong>Database Fields:</strong> Contains createdAt, userId, pawId, type, and 
                  request-specific fields (date/time for visits)
                </p>
              </VExpansionPanelText>
            </VExpansionPanel>

            <VExpansionPanel>
              <VExpansionPanelTitle>Approved</VExpansionPanelTitle>
              <VExpansionPanelText>
                <p class="mb-2">
                  <strong>Definition:</strong> Admin approved the request
                </p>
                <p class="mb-2">
                  <strong>Your Responsibility:</strong> Track whether the visit/adoption happens
                </p>
                <p class="mb-2">
                  <strong>Next Steps:</strong> Mark Fulfilled or Unfulfilled after the scheduled date
                </p>
                <p>
                  <strong>Database Fields:</strong> Adds respondedAt timestamp
                </p>
              </VExpansionPanelText>
            </VExpansionPanel>

            <VExpansionPanel>
              <VExpansionPanelTitle>Rejected</VExpansionPanelTitle>
              <VExpansionPanelText>
                <p class="mb-2">
                  <strong>Definition:</strong> Admin declined the request
                </p>
                <p class="mb-2">
                  <strong>Your Responsibility:</strong> Provide clear rejection reason
                </p>
                <p class="mb-2">
                  <strong>Next Steps:</strong> Mark Unfulfilled to archive
                </p>
                <p>
                  <strong>Database Fields:</strong> Adds respondedAt and comments field with rejection 
                  reason
                </p>
              </VExpansionPanelText>
            </VExpansionPanel>

            <VExpansionPanel>
              <VExpansionPanelTitle>Fulfilled</VExpansionPanelTitle>
              <VExpansionPanelText>
                <p class="mb-2">
                  <strong>Definition:</strong> Visit happened or adoption completed successfully
                </p>
                <p class="mb-2">
                  <strong>Your Responsibility:</strong> Verify completion before marking
                </p>
                <p class="mb-2">
                  <strong>Next Steps:</strong> None - final state, moves to archive
                </p>
                <p>
                  <strong>Impact:</strong> For adoption requests, consider updating or removing the 
                  pet from inventory
                </p>
              </VExpansionPanelText>
            </VExpansionPanel>

            <VExpansionPanel>
              <VExpansionPanelTitle>Unfulfilled</VExpansionPanelTitle>
              <VExpansionPanelText>
                <p class="mb-2">
                  <strong>Definition:</strong> Visit didn't happen or adoption fell through
                </p>
                <p class="mb-2">
                  <strong>Your Responsibility:</strong> Document why it didn't complete (optional)
                </p>
                <p class="mb-2">
                  <strong>Next Steps:</strong> None - final state, moves to archive
                </p>
                <p>
                  <strong>Note:</strong> Also used to archive rejected requests
                </p>
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
        </VCardText>
      </VCard>
    </section>

    <!-- Pet Inventory -->
    <section id="pet-inventory" class="mb-8">
      <h2 class="text-h4 mb-4">
        5. Pet Inventory Management
      </h2>
      <VCard variant="outlined">
        <VCardText>
          <p class="mb-4">
            The Pet Inventory tab allows you to manage all pets in the system. Keep pet information 
            accurate and up-to-date to help users make informed decisions.
          </p>

          <h3 class="text-h6 mb-3">
            Adding a New Pet
          </h3>
          <ol class="ml-6 mb-4">
            <li>
              Navigate to the Pet Inventory tab
            </li>
            <li>
              Click the "Add New Pet" button
            </li>
            <li>
              Fill in all required fields:
              <ul class="ml-6 mt-2">
                <li>
                  <strong>Name:</strong> The pet's name
                </li>
                <li>
                  <strong>Breed:</strong> Specific breed or mix
                </li>
                <li>
                  <strong>Birth Date:</strong> Date of birth (used to calculate age)
                </li>
                <li>
                  <strong>Gender:</strong> Male or Female
                </li>
                <li>
                  <strong>Temperament:</strong> Personality traits (e.g., "Friendly, energetic")
                </li>
                <li>
                  <strong>Activity Level:</strong> Energy level (e.g., "High", "Moderate", "Low")
                </li>
                <li>
                  <strong>Grooming Needs:</strong> Grooming requirements
                </li>
                <li>
                  <strong>Health Condition:</strong> Current health status and any medical notes
                </li>
                <li>
                  <strong>Photo URL:</strong> Link to pet's photo
                </li>
              </ul>
            </li>
            <li>
              Click "Save" to add the pet to the system
            </li>
          </ol>

          <h3 class="text-h6 mb-3">
            Editing Pet Information
          </h3>
          <ol class="ml-6 mb-4">
            <li>
              Find the pet in the inventory list
            </li>
            <li>
              Click the "Edit" button (pencil icon)
            </li>
            <li>
              Update any fields as needed
            </li>
            <li>
              Click "Save" to apply changes
            </li>
          </ol>

          <h3 class="text-h6 mb-3">
            Deleting a Pet
          </h3>
          <p class="mb-2">
            Use this when a pet is permanently removed from the shelter (e.g., adopted, transferred).
          </p>
          <ol class="ml-6 mb-4">
            <li>
              Find the pet in the inventory list
            </li>
            <li>
              Click the "Delete" button (trash icon)
            </li>
            <li>
              Confirm the deletion in the dialog
            </li>
          </ol>

          <VAlert type="warning" variant="tonal" class="mb-4">
            <strong>Warning:</strong> Deleting a pet removes it from the system permanently. Make 
            sure all related adoption requests are completed first.
          </VAlert>

          <h3 class="text-h6 mb-3">
            Renewing a Pet
          </h3>
          <p class="mb-2">
            Use the renew function when a pet returns to the shelter after an adoption that didn't work out.
          </p>
          <ol class="ml-6 mb-4">
            <li>
              Find the pet in the inventory list
            </li>
            <li>
              Click the "Renew" button (refresh icon)
            </li>
            <li>
              Confirm the renewal
            </li>
            <li>
              The pet becomes available for adoption again
            </li>
          </ol>

          <VAlert type="info" variant="tonal">
            <strong>Tip:</strong> Keep detailed health condition notes updated, especially after 
            vet visits. This helps users understand each pet's needs.
          </VAlert>
        </VCardText>
      </VCard>
    </section>

    <!-- Best Practices -->
    <section id="best-practices" class="mb-8">
      <h2 class="text-h4 mb-4">
        6. Best Practices
      </h2>
      <VCard variant="outlined">
        <VCardText>
          <h3 class="text-h6 mb-3">
            Request Management
          </h3>
          <ul class="ml-6 mb-4">
            <li>
              <strong>Respond quickly:</strong> Try to review pending requests within 24 hours
            </li>
            <li>
              <strong>Be specific in rejections:</strong> Provide clear, actionable feedback so users 
              know what to do differently
            </li>
            <li>
              <strong>Follow up on approved requests:</strong> Check in after scheduled visits to 
              mark them fulfilled or unfulfilled
            </li>
            <li>
              <strong>Keep archives clean:</strong> Regularly mark old rejected requests as unfulfilled 
              to keep the active table manageable
            </li>
            <li>
              <strong>Document adoptions:</strong> Add any relevant notes before marking adoptions 
              as fulfilled
            </li>
          </ul>

          <h3 class="text-h6 mb-3">
            Pet Inventory Management
          </h3>
          <ul class="ml-6 mb-4">
            <li>
              <strong>Keep information current:</strong> Update pet details regularly, especially 
              health conditions
            </li>
            <li>
              <strong>Use quality photos:</strong> Clear, well-lit photos help pets get noticed
            </li>
            <li>
              <strong>Be honest about needs:</strong> Accurate temperament and activity level info 
              leads to better matches
            </li>
            <li>
              <strong>Remove adopted pets promptly:</strong> Delete or mark pets as unavailable 
              once adoptions are finalized
            </li>
            <li>
              <strong>Update after vet visits:</strong> Keep health condition notes current
            </li>
          </ul>

          <h3 class="text-h6 mb-3">
            Communication
          </h3>
          <ul class="ml-6 mb-4">
            <li>
              <strong>Professional tone:</strong> Remember users can see your rejection comments
            </li>
            <li>
              <strong>Be encouraging:</strong> Even when rejecting, be supportive and invite future 
              requests
            </li>
            <li>
              <strong>Provide alternatives:</strong> If rejecting due to timing, suggest better times
            </li>
            <li>
              <strong>Contact proactively:</strong> Use the email addresses in requests to follow up 
              directly when needed
            </li>
          </ul>

          <h3 class="text-h6 mb-3">
            Data Quality
          </h3>
          <ul class="ml-6 mb-4">
            <li>
              <strong>Consistent formatting:</strong> Use similar formats for similar types of 
              information across pets
            </li>
            <li>
              <strong>Complete profiles:</strong> Fill in all fields when adding pets
            </li>
            <li>
              <strong>Regular audits:</strong> Periodically review pet inventory for outdated information
            </li>
            <li>
              <strong>Track patterns:</strong> Use the Dashboard to identify trends in requests
            </li>
          </ul>
        </VCardText>
      </VCard>
    </section>

    <!-- Troubleshooting -->
    <section id="troubleshooting" class="mb-8">
      <h2 class="text-h4 mb-4">
        7. Troubleshooting
      </h2>
      <VExpansionPanels variant="accordion">
        <VExpansionPanel>
          <VExpansionPanelTitle>
            I can't see the Admin Panel
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <p class="mb-2">
              <strong>Solution:</strong>
            </p>
            <ul class="ml-6">
              <li>
                Verify you're logged in with an account that has admin privileges
              </li>
              <li>
                Admin access is controlled through Firebase custom claims
              </li>
              <li>
                Contact a system administrator to verify your admin status
              </li>
              <li>
                Try logging out and back in to refresh your permissions
              </li>
            </ul>
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            Actions aren't working (approve, reject, etc.)
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <p class="mb-2">
              <strong>Possible Causes:</strong>
            </p>
            <ul class="ml-6 mb-3">
              <li>
                Network connectivity issues
              </li>
              <li>
                Browser cache problems
              </li>
              <li>
                System temporarily unavailable
              </li>
            </ul>
            <p class="mb-2">
              <strong>Solutions:</strong>
            </p>
            <ul class="ml-6">
              <li>
                Refresh the page and try again
              </li>
              <li>
                Clear your browser cache and cookies
              </li>
              <li>
                Check your internet connection
              </li>
              <li>
                Try using a different browser
              </li>
              <li>
                If problems persist, contact technical support
              </li>
            </ul>
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            Pet photos aren't displaying
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <p class="mb-2">
              <strong>Check:</strong>
            </p>
            <ul class="ml-6">
              <li>
                The photo URL is correct and publicly accessible
              </li>
              <li>
                The image file format is supported (JPG, PNG, WEBP)
              </li>
              <li>
                The hosting service hasn't blocked the image
              </li>
              <li>
                Try uploading to a different image hosting service
              </li>
            </ul>
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            Can't delete or edit a pet
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <p class="mb-2">
              <strong>Solutions:</strong>
            </p>
            <ul class="ml-6">
              <li>
                Verify you have admin permissions
              </li>
              <li>
                Check if there are active requests for that pet (this shouldn't block operations, 
                but be careful)
              </li>
              <li>
                Refresh the page to reload data
              </li>
              <li>
                Try again in a few minutes - there might be temporary system issues
              </li>
            </ul>
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            Dashboard statistics seem incorrect
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <p class="mb-2">
              <strong>Solutions:</strong>
            </p>
            <ul class="ml-6">
              <li>
                Refresh the page - the Dashboard updates in real-time but may need a manual refresh
              </li>
              <li>
                Check individual request tables to verify counts
              </li>
              <li>
                Clear browser cache if numbers don't update after refresh
              </li>
              <li>
                Note that archive requests are included in total counts
              </li>
            </ul>
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            Request is stuck in a particular status
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <p class="mb-2">
              <strong>Understanding:</strong>
            </p>
            <p class="ml-6 mb-3">
              Some statuses are intermediate and require admin action to progress. Review the 
              Request Lifecycle section to understand what actions are available for each status.
            </p>
            <p class="mb-2">
              <strong>If genuinely stuck:</strong>
            </p>
            <ul class="ml-6">
              <li>
                Try refreshing the page
              </li>
              <li>
                Check the browser console for errors
              </li>
              <li>
                Contact technical support with the request ID
              </li>
            </ul>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </section>

    <!-- Support Section -->
    <VCard color="primary" variant="flat" class="mt-8">
      <VCardText class="text-center">
        <h3 class="text-h5 mb-2">
          Need Technical Support?
        </h3>
        <p>
          If you encounter issues not covered in this guide, please contact the technical team 
          with details about the problem, including any error messages and the steps you took 
          before the issue occurred.
        </p>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script lang="ts" setup>
const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
section {
  scroll-margin-top: 20px;
}

ul, ol {
  line-height: 1.8;
}
</style>
