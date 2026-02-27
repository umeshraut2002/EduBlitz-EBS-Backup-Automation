import boto3

# Replace with your EBS volume ID (e.g., vol-0123456789abcdef0)
VOLUME_ID = "vol-09da1deb365bf34e6"


def lambda_handler(event, context):
    """
    Creates an EBS snapshot of the configured volume.
    Called by API Gateway when the user clicks "Create Backup" on the website.
    """
    ec2 = boto3.client("ec2")

    response = ec2.create_snapshot(
        VolumeId=VOLUME_ID,
        Description="EduBlitz automated backup",
    )

    snapshot_id = response["SnapshotId"]

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        "body": snapshot_id,
    }
