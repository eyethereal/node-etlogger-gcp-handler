# node-etlogger-gcp-handler

An ETLogger handler for the Google Cloud Platform. THis is really only appropriate for servers not web browsers. Thus you probably need to use something else to get the log messages from a browser instance to your server at which point you could then be using this or better probably to use the GCP library in your server api directly.

When configuring the handler you pass in an options object. This object contains a `resourceType` and a `labels` field. The `resourceType` must be one known to google and will default to `global`. The `labels` field is a map with key names that are specific to the type. 

The `global` type is okay, but has no identifying information (other than the project id that is added from the credentials).

The only other two resourceType options are `generic_node` and `generic_task`. Nodes are compute resources and tasks are job executions.

The ingest routines aren't going to validate any of these, well maybe projectId, but it is going to add blank values for any that aren't specified. Thus while google has defined things like `location` to mean their GCP locations, you can use your own meaningful locations with the generic types. Particularly in your own namespace - which is probably a good plan.

From <https://cloud.google.com/logging/docs/api/v2/resource-list>


## generic_node

A generic node identifies a machine or other computational resource for which no more specific resource type is applicable. The label values must uniquely identify the node.

**project_id**: The identifier of the GCP project associated with this resource, such as "my-project". (This is added by the API library)

**location**: The GCP or AWS region in which data about the resource is stored. For example, "us-east1-a" (GCP) or "aws:us-east-1a" (AWS).

**namespace**: A namespace identifier, such as a cluster name.

**node_id**: A unique identifier for the node within the namespace, such as a hostname or IP address.

## generic_task

A generic task identifies an application process for which no more specific resource is applicable, such as a process scheduled by a custom orchestration system. The label values must uniquely identify the task.

**project_id**: The identifier of the GCP project associated with this resource, such as "my-project". (This is added by the API library)

**location**: The GCP or AWS region in which data about the resource is stored. For example, "us-east1-a" (GCP) or "aws:us-east-1a" (AWS).

**namespace**: A namespace identifier, such as a cluster name.

**job**: An identifier for a grouping of related tasks, such as the name of a microservice or distributed batch job.

**task_id**: A unique identifier for the task within the namespace and job, such as a replica index identifying the task within the job.

# Credentials

To use the default GCP credentials from the local environment, which is usually what you would do when running on a google resource like a cloud function, simply don't provide any other key file.

When not running on a google resource you will need to provide both a `projectId` when configuring the handler along with a `keyFilename` to a service account key json file.

This service account should have Logs Writer access.
