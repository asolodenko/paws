<template>
  <VContainer fluid class="py-8">
    <h1 class="text-h2 color-primary mb-6">
      User Guide - The Paws
    </h1>

    <div class="mb-8">
      <p class="text-h6 font-weight-regular">
        Welcome to The Paws - a pet adoption platform designed to connect loving homes with pets in need. 
        This guide will help you navigate the app and understand the adoption process.
      </p>
    </div>

    <!-- Table of Contents -->
    <VCard class="mb-8" variant="outlined">
      <VCardTitle class="text-h5">
        Table of Contents
      </VCardTitle>
      <VCardText>
        <VList density="compact">
          <VListItem @click="scrollTo('getting-started')">
            <VListItemTitle>1. Getting Started</VListItemTitle>
          </VListItem>
          <VListItem @click="scrollTo('browsing-pets')">
            <VListItemTitle>2. Browsing Pets</VListItemTitle>
          </VListItem>
          <VListItem @click="scrollTo('authentication')">
            <VListItemTitle>3. Creating an Account</VListItemTitle>
          </VListItem>
          <VListItem @click="scrollTo('visiting-pets')">
            <VListItemTitle>4. Requesting a Visit</VListItemTitle>
          </VListItem>
          <VListItem @click="scrollTo('adoption-eligibility')">
            <VListItemTitle>5. Adoption Eligibility</VListItemTitle>
          </VListItem>
          <VListItem @click="scrollTo('adopting-pets')">
            <VListItemTitle>6. Adoption Process</VListItemTitle>
          </VListItem>
          <VListItem @click="scrollTo('managing-requests')">
            <VListItemTitle>7. Managing Your Requests</VListItemTitle>
          </VListItem>
          <VListItem @click="scrollTo('request-statuses')">
            <VListItemTitle>8. Understanding Request Statuses</VListItemTitle>
          </VListItem>
          <VListItem @click="scrollTo('faq')">
            <VListItemTitle>9. Frequently Asked Questions</VListItemTitle>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>

    <!-- Getting Started -->
    <section id="getting-started" class="mb-8">
      <h2 class="text-h4 mb-4">
        1. Getting Started
      </h2>
      <VCard variant="outlined">
        <VCardText>
          <p class="mb-4">
            The Paws is designed to make pet adoption simple and transparent. Whether you're looking 
            to visit a pet or begin the adoption process, our platform guides you through every step.
          </p>
          <p class="mb-4">
            <strong>What you can do:</strong>
          </p>
          <ul class="ml-6">
            <li>Browse available pets without creating an account</li>
            <li>View detailed information about each pet including breed, age, temperament, and health status</li>
            <li>Schedule visits to meet pets in person (requires login)</li>
            <li>Submit adoption requests (requires login)</li>
            <li>Track your visit and adoption requests</li>
          </ul>
        </VCardText>
      </VCard>
    </section>

    <!-- Browsing Pets -->
    <section id="browsing-pets" class="mb-8">
      <h2 class="text-h4 mb-4">
        2. Browsing Pets
      </h2>
      <VCard variant="outlined">
        <VCardText>
          <p class="mb-4">
            <strong>Viewing the Pet List:</strong>
          </p>
          <ol class="ml-6 mb-4">
            <li>Click on "Paws" in the navigation menu</li>
            <li>Browse through available pets displayed as cards</li>
            <li>Each card shows the pet's photo, name, breed, and key characteristics</li>
          </ol>
          
          <p class="mb-4">
            <strong>Viewing Pet Details:</strong>
          </p>
          <ol class="ml-6 mb-4">
            <li>Click on any pet card to see detailed information</li>
            <li>
              The detail page includes:
              <ul class="ml-6 mt-2">
                <li><strong>Basic Info:</strong> Name, breed, gender, birth date</li>
                <li><strong>Characteristics:</strong> Temperament, activity level, grooming needs</li>
                <li><strong>Health:</strong> Current health condition and any special needs</li>
              </ul>
            </li>
          </ol>
        </VCardText>
      </VCard>
    </section>

    <!-- Authentication -->
    <section id="authentication" class="mb-8">
      <h2 class="text-h4 mb-4">
        3. Creating an Account
      </h2>
      <VCard variant="outlined">
        <VCardText>
          <p class="mb-4">
            To request visits or adoptions, you need to create an account using Google authentication.
          </p>
          
          <p class="mb-4">
            <strong>How to Sign In:</strong>
          </p>
          <ol class="ml-6 mb-4">
            <li>Click the "Login" button in the header</li>
            <li>Click "Sign in with Google"</li>
            <li>Select your Google account</li>
            <li>Grant necessary permissions</li>
            <li>You'll be redirected back to the app, now logged in</li>
          </ol>
          
          <VAlert type="info" variant="tonal" class="mt-4">
            <strong>Note:</strong> Your email and display name will be associated with your requests 
            to help the shelter staff identify and contact you.
          </VAlert>
        </VCardText>
      </VCard>
    </section>

    <!-- Visiting Pets -->
    <section id="visiting-pets" class="mb-8">
      <h2 class="text-h4 mb-4">
        4. Requesting a Visit
      </h2>
      <VCard variant="outlined">
        <VCardText>
          <p class="mb-4">
            Visiting pets helps you make an informed decision about adoption. Here's how to schedule a visit:
          </p>
          
          <p class="mb-4">
            <strong>Steps to Request a Visit:</strong>
          </p>
          <ol class="ml-6 mb-4">
            <li>Make sure you're logged in</li>
            <li>Navigate to the pet's detail page</li>
            <li>Click the "Request to Visit" button</li>
            <li>
              In the dialog that appears:
              <ul class="ml-6 mt-2">
                <li>Select your preferred visit date using the calendar</li>
                <li>Choose a time slot for your visit</li>
              </ul>
            </li>
            <li>Click "Send" to submit your request</li>
          </ol>
          
          <p class="mb-4">
            <strong>What Happens Next:</strong>
          </p>
          <ul class="ml-6 mb-4">
            <li>Your request will be reviewed by shelter administrators</li>
            <li>You'll receive an update within 24 hours</li>
            <li>Check your Account page to see the status of your request</li>
            <li>If approved, you can visit the shelter at your scheduled time</li>
          </ul>

          <VAlert type="warning" variant="tonal" class="mt-4">
            <strong>Important:</strong> You must select both a date and time to submit a visit request. 
            The time field is required.
          </VAlert>
        </VCardText>
      </VCard>
    </section>

    <!-- Adoption Eligibility -->
    <section id="adoption-eligibility" class="mb-8">
      <h2 class="text-h4 mb-4">
        5. Adoption Eligibility
      </h2>
      <VCard variant="outlined">
        <VCardText>
          <p class="mb-4">
            To ensure the best match between pets and their future families, The Paws requires you to 
            complete <strong>5 fulfilled visit requests</strong> with a specific pet before you can submit 
            an adoption request for that pet.
          </p>

          <h3 class="text-h6 mb-3">
            Understanding the Visit Progress Tracker
          </h3>
          <p class="mb-4">
            When you're logged in and viewing a pet's detail page, you'll see a "Your Visit Progress" 
            card that tracks your eligibility:
          </p>

          <VRow class="mb-4">
            <VCol cols="12" md="6">
              <VCard color="blue-lighten-5">
                <VCardTitle class="text-subtitle-1">
                  <VIcon color="blue" class="mr-2">
                    mdi-information
                  </VIcon>
                  Progress Indicator
                </VCardTitle>
                <VCardText>
                  <ul class="ml-4">
                    <li>
                      Shows your current visit count (e.g., "3/5 visits completed")
                    </li>
                    <li>
                      Displays a visual progress bar with color coding:
                      <ul class="ml-6 mt-2">
                        <li>
                          <strong>Blue:</strong> 0-2 visits
                        </li>
                        <li>
                          <strong>Orange:</strong> 3-4 visits
                        </li>
                        <li>
                          <strong>Green:</strong> 5+ visits (eligible!)
                        </li>
                      </ul>
                    </li>
                    <li>
                      Updates in real-time as admins fulfill your visit requests
                    </li>
                  </ul>
                </VCardText>
              </VCard>
            </VCol>

            <VCol cols="12" md="6">
              <VCard color="green-lighten-5">
                <VCardTitle class="text-subtitle-1">
                  <VIcon color="green" class="mr-2">
                    mdi-check-circle
                  </VIcon>
                  Becoming Eligible
                </VCardTitle>
                <VCardText>
                  <ul class="ml-4">
                    <li>
                      Schedule and complete 5 visits with the pet
                    </li>
                    <li>
                      Each visit must be approved and marked as "Fulfilled" by shelter staff
                    </li>
                    <li>
                      Once you reach 5 fulfilled visits, the "Adopt Pet" button becomes active
                    </li>
                    <li>
                      You'll see a green checkmark with "You're eligible to adopt this pet!"
                    </li>
                  </ul>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

          <VAlert type="info" variant="tonal" class="mb-4">
            <strong>Why 5 Visits?</strong> Multiple visits help ensure you and the pet are truly 
            compatible. It gives you time to observe the pet's behavior in different situations 
            and make an informed, confident decision.
          </VAlert>

          <p class="mb-4">
            <strong>What counts as a fulfilled visit:</strong>
          </p>
          <ul class="ml-6 mb-4">
            <li>
              You submit a visit request with a specific date and time
            </li>
            <li>
              The shelter approves your request
            </li>
            <li>
              You visit the shelter at the scheduled time
            </li>
            <li>
              Shelter staff confirms your visit and marks it as "Fulfilled"
            </li>
          </ul>

          <VAlert type="warning" variant="tonal">
            <strong>Important:</strong> Visit counts are specific to each pet. If you're interested 
            in multiple pets, you'll need to complete 5 visits with each individual pet before you 
            can adopt them.
          </VAlert>
        </VCardText>
      </VCard>
    </section>

    <!-- Adopting Pets -->
    <section id="adopting-pets" class="mb-8">
      <h2 class="text-h4 mb-4">
        6. Adoption Process
      </h2>
      <VCard variant="outlined">
        <VCardText>
          <p class="mb-4">
            Once you've completed 5 visits with a pet and become eligible, you're ready to submit 
            an adoption request!
          </p>
          
          <p class="mb-4">
            <strong>Steps to Request Adoption:</strong>
          </p>
          <ol class="ml-6 mb-4">
            <li>
              Make sure you're logged in
            </li>
            <li>
              Navigate to the pet's detail page
            </li>
            <li>
              Verify your visit progress shows 5/5 visits completed
            </li>
            <li>
              Click the "Adopt Pet" button (it will be enabled once you're eligible)
            </li>
            <li>
              Read the information in the dialog about shelter adoption rules
            </li>
            <li>
              Click "Send" to submit your adoption request
            </li>
          </ol>

          <VAlert type="warning" variant="tonal" class="mb-4">
            <strong>Note:</strong> The "Adopt Pet" button will be disabled (grayed out) until you 
            complete 5 fulfilled visits. You'll see a message: "Visit at least 5 times to unlock adoption"
          </VAlert>
          
          <p class="mb-4">
            <strong>Review Process:</strong>
          </p>
          <ul class="ml-6 mb-4">
            <li>
              The shelter administration will review your request within 24 hours
            </li>
            <li>
              They may contact you for additional information or to schedule an interview
            </li>
            <li>
              Check your Account page regularly for status updates
            </li>
          </ul>
          
          <p class="mb-4">
            <strong>If Approved:</strong>
          </p>
          <ul class="ml-6 mb-4">
            <li>
              You'll see an approval notification in your Account page
            </li>
            <li>
              The pet's status will change to "Pending Adoption" in the system
            </li>
            <li>
              The shelter will contact you to arrange the adoption paperwork and pickup
            </li>
            <li>
              Once the adoption is complete, the request will be marked as "Fulfilled"
            </li>
            <li>
              The pet will be marked as "Adopted" and removed from available listings
            </li>
          </ul>

          <VAlert type="success" variant="tonal" class="mt-4">
            <strong>Success!</strong> After completing the adoption, you'll have given a loving pet 
            a forever home. The shelter staff will provide you with all necessary care information 
            and support for your new family member.
          </VAlert>
        </VCardText>
      </VCard>
    </section>

    <!-- Managing Requests -->
    <section id="managing-requests" class="mb-8">
      <h2 class="text-h4 mb-4">
        7. Managing Your Requests
      </h2>
      <VCard variant="outlined">
        <VCardText>
          <p class="mb-4">
            Your Account page is your central hub for tracking all visit and adoption requests.
          </p>
          
          <p class="mb-4">
            <strong>Accessing Your Account:</strong>
          </p>
          <ol class="ml-6 mb-4">
            <li>Click on "Account" in the navigation menu (visible when logged in)</li>
            <li>You'll see your account information at the top (name and email)</li>
            <li>
              Below that, you'll find two tabs:
              <ul class="ml-6 mt-2">
                <li><strong>Visit Requests:</strong> All your scheduled and past visit requests</li>
                <li><strong>Adoption Requests:</strong> All your adoption applications</li>
              </ul>
            </li>
          </ol>
          
          <p class="mb-4">
            <strong>Request Tables:</strong>
          </p>
          <p class="mb-2">
            Each tab contains two tables:
          </p>
          <ul class="ml-6 mb-4">
            <li>
              <strong>Active Requests:</strong> Shows pending and approved requests
              <ul class="ml-6 mt-2">
                <li>Type (Visit/Adoption)</li>
                <li>Pet name</li>
                <li>Date (for visits)</li>
                <li>Current status</li>
                <li>Any comments from administrators</li>
              </ul>
            </li>
            <li>
              <strong>Archive:</strong> Shows completed, rejected, or unfulfilled requests
              <ul class="ml-6 mt-2">
                <li>Historical record of all finalized requests</li>
                <li>Includes rejection reasons if applicable</li>
              </ul>
            </li>
          </ul>

          <p class="mb-4">
            <strong>Logging Out:</strong>
          </p>
          <p class="ml-6">
            Click the "Logout" button on your Account page to sign out securely.
          </p>
        </VCardText>
      </VCard>
    </section>

    <!-- Request Statuses -->
    <section id="request-statuses" class="mb-8">
      <h2 class="text-h4 mb-4">
        8. Understanding Request Statuses
      </h2>
      <VCard variant="outlined">
        <VCardText>
          <p class="mb-4">
            Your requests go through different statuses. Here's what each one means:
          </p>
          
          <VRow>
            <VCol cols="12" md="6">
              <VCard color="orange-lighten-5" class="mb-4">
                <VCardTitle class="text-h6">
                  <VIcon color="orange" class="mr-2">
                    mdi-clock-outline
                  </VIcon>
                  Pending
                </VCardTitle>
                <VCardText>
                  Your request has been submitted and is awaiting review by shelter administrators. 
                  This typically takes up to 24 hours.
                </VCardText>
              </VCard>
            </VCol>
            
            <VCol cols="12" md="6">
              <VCard color="green-lighten-5" class="mb-4">
                <VCardTitle class="text-h6">
                  <VIcon color="green" class="mr-2">
                    mdi-check-circle
                  </VIcon>
                  Approved
                </VCardTitle>
                <VCardText>
                  Great news! Your request has been approved. For visits, you can come at your 
                  scheduled time. For adoptions, the shelter will contact you with next steps.
                </VCardText>
              </VCard>
            </VCol>
            
            <VCol cols="12" md="6">
              <VCard color="red-lighten-5" class="mb-4">
                <VCardTitle class="text-h6">
                  <VIcon color="red" class="mr-2">
                    mdi-close-circle
                  </VIcon>
                  Rejected
                </VCardTitle>
                <VCardText>
                  Unfortunately, your request couldn't be approved at this time. Check the comments 
                  field for the reason. You're welcome to submit a new request.
                </VCardText>
              </VCard>
            </VCol>
            
            <VCol cols="12" md="6">
              <VCard color="blue-lighten-5" class="mb-4">
                <VCardTitle class="text-h6">
                  <VIcon color="blue" class="mr-2">
                    mdi-check-all
                  </VIcon>
                  Fulfilled
                </VCardTitle>
                <VCardText>
                  The visit or adoption has been completed successfully. This is a final status 
                  and the request will appear in your archive.
                </VCardText>
              </VCard>
            </VCol>
            
            <VCol cols="12" md="6">
              <VCard color="grey-lighten-3" class="mb-4">
                <VCardTitle class="text-h6">
                  <VIcon color="grey-darken-2" class="mr-2">
                    mdi-cancel
                  </VIcon>
                  Unfulfilled
                </VCardTitle>
                <VCardText>
                  The visit didn't happen or the adoption wasn't completed. This could be due to 
                  cancellation or other circumstances. This is a final status.
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </section>

    <!-- FAQ -->
    <section id="faq" class="mb-8">
      <h2 class="text-h4 mb-4">
        9. Frequently Asked Questions
      </h2>
      <VExpansionPanels variant="accordion">
        <VExpansionPanel>
          <VExpansionPanelTitle>
            Do I need an account to browse pets?
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            No! You can browse all available pets and view their details without creating an account. 
            However, you'll need to sign in with Google to request visits or adoptions.
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            Why do I need to visit a pet 5 times before adopting?
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            The 5-visit requirement ensures that both you and the pet are truly compatible. Multiple 
            visits allow you to observe the pet's behavior in different situations, interact with them 
            in various contexts, and make a confident, informed decision about adoption. This significantly 
            increases the success rate of adoptions and reduces the likelihood of pets being returned to 
            the shelter.
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            Can I adopt a pet without completing 5 visits?
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            No, the 5-visit requirement is mandatory for all adoptions. The "Adopt Pet" button will 
            remain disabled until you have 5 fulfilled visits with that specific pet. This policy is 
            in place to protect both the pets and adopters, ensuring the best possible matches.
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            Do my visits with one pet count toward adopting a different pet?
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            No, visit counts are specific to each individual pet. If you're interested in multiple 
            pets, you'll need to complete 5 fulfilled visits with each pet separately before you can 
            submit an adoption request for them. This ensures you have adequate experience with the 
            specific pet you wish to adopt.
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            What if my scheduled visit is cancelled? Does it count toward the 5 visits?
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            Only visits that are marked as "Fulfilled" by shelter staff count toward your eligibility. 
            If a visit is cancelled, rejected, or marked as "Unfulfilled", it will not count toward 
            your 5 required visits. You can track your progress on each pet's detail page.
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            How long does it take to get a response to my request?
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            Shelter administrators typically review requests within 24 hours. You can check the 
            status of your request anytime on your Account page.
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            Can I request to visit multiple pets?
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            Yes! You can submit visit requests for as many pets as you'd like. Each request is 
            handled separately, so you can schedule visits with different pets on different days.
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            What if I need to cancel a visit?
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            If you need to cancel or reschedule a visit, please contact the shelter directly. 
            You can then submit a new visit request for a different date and time.
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            Why don't I see some pets in the list anymore?
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            Pets that have been adopted are automatically removed from the available pets list. 
            This ensures you only see pets that are currently available for adoption. If a pet 
            shows a "Pending Adoption" status, it means an adoption is in progress but not yet finalized.
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            Why was my request rejected?
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            Requests may be rejected for various reasons, such as the pet being unavailable, 
            scheduling conflicts, or incomplete information. Check the comments field on your 
            request for specific details. You're welcome to submit a new request or contact 
            the shelter for clarification.
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            How do I know if my adoption is finalized?
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            Once you've completed all adoption paperwork and taken your new pet home, the shelter 
            will mark your adoption request as "Fulfilled". You'll see this status update in your 
            Account page. The pet will also be marked as "Adopted" in the system.
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel>
          <VExpansionPanelTitle>
            Is my personal information secure?
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            Yes! We use Google Authentication for secure login, and your data is stored in Firebase, 
            which employs industry-standard security practices. Your email and name are only used 
            to process requests and contact you about adoptions.
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </section>

    <!-- Contact Section -->
    <VCard color="primary" variant="flat" class="mt-8">
      <VCardText class="text-center">
        <h3 class="text-h5 mb-2">
          Need More Help?
        </h3>
        <p>
          If you have questions not covered in this guide, please contact the shelter directly 
          or reach out through our support channels.
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
