-- (NSString *)classifySnap:(NSArray *)data hardwareRevision:(NSNumber *)hardwareRevision {
-    int sscX = 0;
-    int sscY = 0;
-    int sscZ = 0;
-
-    int maxSscX = 0;
-    int maxSscY = 0;
-    int maxSscZ = 0;
-
-    double peakDiffX = 0;
-    double peakDiffY = 0;
-    double peakDiffZ = 0;
-
-    double maxPeakDiffX = 0;
-    double maxPeakDiffY = 0;
-    double maxPeakDiffZ = 0;
-
-    //double blipThreshold = -0.244140625;
-    double blipThreshold = -0.061035156;
-
-    // For Rev D devices, increase blip threshold.
-    if ([hardwareRevision unsignedShortValue] == 2) {
-        blipThreshold *= 2;
-    }
-
-    TLMAccelerometerEvent *accel = data[0];
-    double maxX = accel.vector.x;
-    double maxY = accel.vector.y;
-    double maxZ = accel.vector.z;
-    double minX = accel.vector.x;
-    double minY = accel.vector.y;
-    double minZ = accel.vector.z;
-
-    for (int i = 1; i < data.count - 1; i++) {
-        TLMAccelerometerEvent *currentAccel = data[i];
-        TLMAccelerometerEvent *prevAccel = data[i - 1];
-        TLMAccelerometerEvent *nextAccel = data[i + 1];
-
-        if (((currentAccel.vector.x -
-              prevAccel.vector.x) * (nextAccel.vector.x - currentAccel.vector.x)) <
-            blipThreshold) {
-            sscX++;
-        }
-        if (((currentAccel.vector.y -
-              prevAccel.vector.y) * (nextAccel.vector.y - currentAccel.vector.y)) <
-            blipThreshold) {
-            sscY++;
-        }
-        if (((currentAccel.vector.z -
-              prevAccel.vector.z) * (nextAccel.vector.z - currentAccel.vector.z)) <
-            blipThreshold) {
-            sscZ++;
-        }
-
-        if (currentAccel.vector.x > maxX) {
-            maxX = currentAccel.vector.x;
-        }
-        if (currentAccel.vector.y > maxY) {
-            maxY = currentAccel.vector.y;
-        }
-        if (currentAccel.vector.z > maxZ) {
-            maxZ = currentAccel.vector.z;
-        }
-
-        if (currentAccel.vector.x < minX) {
-            minX = currentAccel.vector.x;
-        }
-        if (currentAccel.vector.y < minY) {
-            minY = currentAccel.vector.y;
-        }
-        if (currentAccel.vector.z < minZ) {
-            minZ = currentAccel.vector.z;
-        }
-    }
-
-    if (sscX > maxSscX) {
-        maxSscX = sscX;
-    }
-    if (sscY > maxSscY) {
-        maxSscY = sscY;
-    }
-    if (sscZ > maxSscZ) {
-        maxSscZ = sscZ;
-    }
-
-    peakDiffX = maxX - minX;
-    peakDiffY = maxY - minY;
-    peakDiffZ = maxZ - minZ;
-
-    if (peakDiffX > maxPeakDiffX) {
-        maxPeakDiffX = peakDiffX;
-    }
-    if (peakDiffY > maxPeakDiffY) {
-        maxPeakDiffY = peakDiffY;
-    }
-    if (peakDiffZ > maxPeakDiffZ) {
-        maxPeakDiffZ = peakDiffZ;
-    }
-
-    //NSLog(@"X: %d Y: %d Z: %d maxDiff X: %f Y: %f Z: %f", maxSscX, maxSscY, maxSscZ, maxPeakDiffX, maxPeakDiffY, maxPeakDiffZ);
-
-    if (((maxSscX >= 1 && maxSscY >= 3 /*&& maxSscZ >= 2*/) || maxSscX + maxSscY + maxSscZ >= 5) &&
-        (maxPeakDiffX >= MIN_DIFF_THRESHOLD && maxPeakDiffY >= MIN_DIFF_THRESHOLD && maxPeakDiffZ >=
-         MIN_DIFF_THRESHOLD) &&
-        (maxPeakDiffX <= MAX_DIFF_THRESHOLD && maxPeakDiffY <= MAX_DIFF_THRESHOLD && maxPeakDiffZ <=
-         MAX_DIFF_THRESHOLD)) {
-        MyoLogDebug(@"SNAP DETECTED!");
-        self.lastRecognizeDate = [NSDate date];
-        return TLMMyoDidReceiveSnapGestureNotification;
-    }
-
-    return @"";
-}
-
-@end