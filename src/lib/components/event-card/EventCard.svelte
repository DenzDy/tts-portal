<script lang="ts">
    export let eventname, eventdescription, eventdate, eventimagelink;
    function transformDriveLink(url : string) {
        const match = url.match(/\/d\/([^/]+)\//);
        if (!match || match.length < 2) {
            throw new Error("Invalid Google Drive URL format.");
        }
        const fileId = match[1];
        const directUrl = `https://drive.google.com/thumbnail?id=${fileId}`;
        return directUrl;
    }
    const newImageLink = transformDriveLink(eventimagelink);

</script>

<div class="w-full h-fit min-h-[420px] mb-4 rounded-lg border-4 border-[#69ADC6] p-3 flex flex-col gap-3">
    <h1 class="font-[League_Spartan] text-2xl font-semibold">{eventname}</h1>
    <p class="font-[League_Spartan] text-md font-semibold">{eventdate}</p>
    <img src={newImageLink} alt="" srcset="" class="w-full h-[225px] object-cover rounded-xl">
    <p class="font-[Garet] text-md">{eventdescription}</p>
</div>