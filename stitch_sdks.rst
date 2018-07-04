.. role:: javascript(code)
  :language: javascript

==============
Stitch SDK API
==============

:Spec: ?
:Spec Version: 4.0.0
:Title: Stitch SDK API
:Authors: Adam Chelminski
:Advisors: Jason Flax, Eric Daniels
:Status: In Progress
:Type: Standards
:Minimum Server Version: cloud-2.0.0
:Last Modified: July 6, 2018

.. contents::

--------

Abstract
========

MongoDB Stitch supports client interactions over an HTTP client API. This specification defines the how a Stitch client SDK should use this API backend via this API. As not all languages/environments have the same abilities, parts of the spec may or may not apply. These sections have been called out.

Specification
=============

This specification is about `Guidance`_ for the developer-facing API of a Stitch SDK. Other than specifying the HTTP endpoints that the SDK needs to use on the Stitch server, it does not define internal implementation structure and provides room and flexibility for the idioms and differences in languages and frameworks.

-----------
Definitions
-----------

META
----

The keywords “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in `RFC 2119 <https://www.ietf.org/rfc/rfc2119.txt>`_.

Terms
-----

Stitch
  The MongoDB Stitch backend-as-a-service backend server.

Client SDK
  A software library for a particular language or platform that provides access to MongoDB Stitch services made available by the Stitch HTTP client API.

Client App ID
  The unique identification string required by clients to access their application and its services.

Authentication Provider
  An authentication principal in Stitch that can accept credentials to create a new Stitch user from an identity, or authenticate an existing identity. In either case, after successfully authenticating, Stitch issues access tokens and refresh tokens that the client SDK can use to make authenticated requests as a particular Stitch user. Examples of authentication providers include the username/password provider, and the Facebook OAuth2 provider.

Service
  Any third party extension that is supported by Stitch as a “service” in the Stitch UI.

Mobile Device
  Any reference to a device using the iOS and/or Android platforms, natively or otherwise.

Push Notification
  A message sent to a mobile device by an external messaging service (e.g. Firebase Cloud Messaging). The mobile device can handle the message in any way it wants. Typically, the message is used to display a notification on the device.

Push Provider
  An endpoint in the Stitch client API which can be used to register a Stitch user for push notifications from an external messaging service.

End-User Developer
  A person using a client SDK to build client applications with MongoDB Stitch.


--------
Guidance
--------

Documentation
-------------
The documentation provided in code below is merely for SDK authors and SHOULD NOT be taken as required documentation for the SDK.


Operations & Properties
-----------------------
All SDKs MUST offer the operations and properties defined in the following sections unless otherwise specified. This does not preclude an SDK from offering more.

Operation Parameters
--------------------
All SDKs MUST offer the same options for each operation as defined in the following sections. This does not preclude a SDKs from offering more. An SDK SHOULD NOT require a user to specify optional parameters, denoted by the Optional<> signature. Unless otherwise specified, optional values should not be sent to the Stitch server.

~~~~~~~~~~
Deviations
~~~~~~~~~~

A non-exhaustive list of acceptable deviations are as follows:

* Using named parameters instead of an options hash. For instance, ``collection.find({x:1}, sort: {a: -1})``.

* When using an ``Options`` class, if multiple ``Options`` classes are structurally equatable, it is permissible to consolidate them into one with a clear name. For instance, it would be permissible to use the name ``UpdateOptions`` as the options for ``UpdateOne`` and ``UpdateMany``.

* Using a fluent style builder for find or aggregate:

  .. code:: typescript

    collection.find({x: 1}).sort({a: -1}).skip(10);

  When using a fluent-style builder, all options should be named rather than inventing a new word to include in the pipeline (like options). Required parameters are still required to be on the initiating method.

  In addition, it is imperative that documentation indicate when the order of operations is important. For instance, skip and limit in find is order-irrelevant where skip and limit in aggregate is order-relevant.

Naming
------

All SDKs MUST name operations, objects, and parameters as defined in the following sections.

Deviations are permitted as outlined below.


~~~~~~~~~~
Deviations
~~~~~~~~~~

When deviating from a defined name, an author should consider if the altered name is recognizable and discoverable to the user of another SDK.

A non-exhaustive list of acceptable naming deviations are as follows:

* Using the property “isLoggedIn” as an example, Kotlin would use “loggedIn”, while Java would use “isLoggedIn()”. However, calling it “isAuthenticated” would not be acceptable.
* Using the method “loginWithCredential” as an example, Java would use “loginWithCredential”, Swift would use “login(withCredential: ...“, and Python would use “login_with_credential. However, calling it “loginWithSecret” would not be acceptable.
* Using "loggedIn" rather than "isLoggedIn". Some languages idioms prefer the use of "is", "has", or "was" and this is acceptable.

--------------
Client SDK API
--------------

This section describes how a client SDK should communicate with Stitch and expose its functionality. The section will provide room and flexibility for the idioms and differences in languages and frameworks.

Each of the top-level headers in this section should be made available as a language-appropriate structure that can hold state and expose methods and properties. (e.g. class or interface with class implementation in Java, class or protocol with class/struct implementation in Swift).

For the purposes of this section, we will use the terms “interface” and “object”, but appropriate language constructs can be substituted for each SDK.

If a method is marked as ASYNC ALLOWED, the method SHOULD be implemented to return its result in an asynchronous manner if it is appropriate for the environment. The mechanism for this will depend on the platform and environment (e.g. via Promises in ES6, Tasks for Android, closure callbacks in iOS). However, some environments may not require or desire methods with asynchronous behavior (e.g. Java Server SDK). 

If a method is marked as ERROR POSSIBLE, the method MUST be written to cleanly result in an error when there is a server error, request error, or other invalid state. The mechanism for error handling will depend on the the language and environment, as well as whether the method is implemented synchronously or asynchronously. See the section on `Error Handling`_ for more information.

When methods contain parameters that are wrapped in an optional type, the method can be overloaded to have variants that don’t accept the parameter at all.

Stitch
------

An SDK MUST have a Stitch interface which serves as the entry-point for initializing and retrieving client objects. The interface is responsible for statically storing initialized app clients. If a language has a multithreaded model, the implementation of this interface SHOULD be thread safe. It it cannot be made in such a way, the documentation MUST state it. The following methods MUST be provided, unless otherwise specified in the comment for a particular method:

.. code:: typescript

  interface Stitch {
      /**
       * (OPTIONAL)
       *
       * Initialize the Stitch SDK so that app clients can properly report 
       * device information to the Stitch server.
       *
       * This method should only be implemented for environments where the
       * initialization requires access to a platform-specific context object.
       * (e.g. android.content.Context in the Android SDK)
       *
       * If appropriate and possible for the environment, this method MAY be
       * called automatically when the user includes the SDK.
       */
      static initialize(context: PlatformSpecificContext): void

      /**
       * (REQUIRED, ERROR POSSIBLE)
       *
       * Initialize an app client for a specific app and configuration.
       * The client initialized by this method will be retrievable by
       * the getDefaultAppClient and getAppClient methods. If this method is
       * called more than once, it should result in a language-appropriate 
       * error, as only one default app client should ever be specified.
       *
       * If appropriate and possible for the environment, this method MAY be
       * called automatically when the user includes the SDK.
       */
      static initializeDefaultAppClient(
          clientAppId: string,
          config: Optional<StitchAppClientConfiguration>
      ): StitchAppClient

      
      /**
       * (REQUIRED, ERROR POSSIBLE)
       *
       * Initialize an app client for a specific app and configuration.
       * The client initialized by this method will be retrievable by
       * the getAppClient method. If this method is called more than
       * once for a specific client app ID, it should result in a
       * language-appropriate error, as only one app client should be specified
       * for each client app ID.
       *
       * If appropriate and possible for the environment, this method MAY be
       * called automatically when the user includes the SDK.
       */
      static initializeAppClient(
          clientAppId: string,
          config: Optional<StitchAppClientConfiguration>
      ): StitchAppClient

      /**
       * (REQUIRED, ERROR POSSIBLE)
       *
       * Gets the default initialized app client. If one has not been set, then
       * a language-appropriate error should be thrown/returned.
       */
      static getDefaultAppClient(): StitchAppClient

      /**
       * (REQUIRED, ERROR POSSIBLE)
       *
       * Gets an app client by its client app ID if it has been initialized;
       * should result in a language-appropriate error if none can be found.
       */
      static getAppClient(clientAppId: string): StitchAppClient
  }

StitchAppClient
---------------

An SDK MUST have a StitchAppClient interface, which serves as the primary means of communicating with the Stitch server. The following methods MUST be provided, unless otherwise specified in the comment for a particular method:

.. code:: typescript

  interface StitchAppClient {

      /**
       * (REQUIRED)
       *
       * Gets a StitchAuth object which can be used to view and modify the
       * authentication status of this Stitch client.
       */
      getAuth(): StitchAuth

      /**
       * (OPTIONAL)
       *
       * Gets a StitchPush object which can be used to get push provider clients 
       * which can be used to subscribe the currently authenticated user for
       * push notifications from an external messaging system. MUST be
       * implemented in SDKs intended for mobile device platforms.
       */
      getPush(): StitchPush

      /**
       * (REQUIRED - see “Factories” for exceptions) 
       *
       * Gets a client for a particular named Stitch service.
       * See the “Factories” section for details on the factory type.
       */
      getServiceClient<T>(
          factory: NamedServiceClientFactory<T>, 
          serviceName: string
      ): T

      /**
       * (REQUIRED - see “Factories” for exceptions)
       *
       * Gets a client for a particular Stitch service
       * See the “Factories” section for details on the factory type.
       */
      getServiceClient<T>(factory: ServiceClientFactory<T>): T

      /**
       * (REQUIRED, ASYNC ALLOWED, ERROR POSSIBLE) 
       *
       * Calls the function in MongoDB Stitch with the provided name
       * and arguments. If no error occurs in carrying out the request, the 
       * extended JSON response by the Stitch server should be decoded into 
       * the type T.
       *
       * SHOULD also accept additional arguments to modify the request timeout,      
       * and to provide a mechanism for decoding.
       */
      callFunction<T>(name: string, args: List<BsonValue>): T

      /**
       * (REQUIRED, ASYNC ALLOWED, ERROR POSSIBLE)
       *
       * Calls the function in MongoDB Stitch with the provided name
       * and arguments. If no error occurs in carrying out the request, the 
       * response by the Stitch server should be ignored.
       * 
       * SHOULD also accept an additional argument to modify the request 
       * timeout.
       */
      callFunction(name: string, args: List<BsonValue>): void
  }

For the methods that make network requests, the following list enumerates how each of the requests should be constructed, as well as the shapes of the responses from the Stitch server:

* ``callFunction``
   - Authenticated: yes, with access tokens
   - Endpoint: ``POST /api/client/v2.0/app/<client_app_id>/functions/call``
   - Request Body:
      + 
        ::
          {
             "name": (name argument),
             "arguments": (args argument)
          }

      + The arguments field in the request body MUST be encoded as canonical extended JSON. See the specification on `MongoDB extended JSON <https://github.com/mongodb/specifications/blob/master/source/extended-json.rst>`_ for more information.

   - Response Shape:
      + The extended JSON representation of the called Stitch function's return value.

StitchAuth
----------

StitchAuthListener
------------------

StitchPush
----------

~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Sample Push Client Interface
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Client Configuration
--------------------

~~~~~~~~~~~~~~~~~~~~~~~~~
StitchClientConfiguration
~~~~~~~~~~~~~~~~~~~~~~~~~

~~~~~~~~~~~~~~~~~~~~~~~~~~~~
StitchAppClientConfiguration
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

User Information
----------------

~~~~~~~~~~
StitchUser
~~~~~~~~~~

~~~~~~~~~~~~~~~~~
StitchUserProfile
~~~~~~~~~~~~~~~~~

~~~~~~~~~~~~~~~~~~
StitchUserIdentity
~~~~~~~~~~~~~~~~~~

Factories
---------

Authentication Credentials
--------------------------


~~~~~~~~~~~~~~~~
StitchCredential
~~~~~~~~~~~~~~~~


ProviderCapabilities
^^^^^^^^^^^^^^^^^^^^

~~~~~~~~~~~~~~~~~~~
AnonymousCredential
~~~~~~~~~~~~~~~~~~~

~~~~~~~~~~~~~~~~
CustomCredential
~~~~~~~~~~~~~~~~

~~~~~~~~~~~~~~~~~~
FacebookCredential
~~~~~~~~~~~~~~~~~~

~~~~~~~~~~~~~~~~
GoogleCredential
~~~~~~~~~~~~~~~~

~~~~~~~~~~~~~~~~~~~~~~
ServerApiKeyCredential
~~~~~~~~~~~~~~~~~~~~~~

~~~~~~~~~~~~~~~~~~~~
UserApiKeyCredential
~~~~~~~~~~~~~~~~~~~~

~~~~~~~~~~~~~~~~~~~~~~
UserPasswordCredential
~~~~~~~~~~~~~~~~~~~~~~

Authentication Provider Clients
-------------------------------

~~~~~~~~~~~~~~~~~~~~~~~~~~~~
UserApiKeyAuthProviderClient
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

UserApiKey
^^^^^^^^^^

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
UserPasswordAuthProviderClient
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Mechanism for Making Requests
-----------------------------

~~~~~~~~
Endpoint
~~~~~~~~

~~~~~~~~~~~~~~
Authentication
~~~~~~~~~~~~~~

Proactive Token Refresher
^^^^^^^^^^^^^^^^^^^^^^^^^

~~~~~~~~~~~~
Request Body
~~~~~~~~~~~~

~~~~~~~~~~~~~~
Response Shape
~~~~~~~~~~~~~~

~~~~~~~~
Behavior 
~~~~~~~~

Error Handling
--------------

~~~~~~~~~~~~~~
Service Errors
~~~~~~~~~~~~~~

~~~~~~~~~~~~~~
Request Errors
~~~~~~~~~~~~~~

~~~~~~~~~~~~~
Client Errors
~~~~~~~~~~~~~

Test Plan
=========

Motivation
==========

BackwardsCompatibility
======================

Reference Implementations
=========================

Q & A
=====

This section will be updated with frequently asked questions from end-user developers and SDK authors.

Changes
=======

* 2018-07-06: Initial draft
